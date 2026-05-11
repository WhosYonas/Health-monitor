from typing import Optional

import crud
import models
import schemas
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from database import get_db

from .auth import caregiver_oauth2_scheme, decode_access_token

router = APIRouter()


@router.get("/below-threshold", response_model=list[schemas.PatientBelowThreshold])
def get_patients_below_threshold(
    spo2_min: Optional[float] = 95.0,
    hr_min: Optional[int] = 50,
    temp_max: Optional[float] = 38.0,
    token: str = Depends(caregiver_oauth2_scheme),
    db: Session = Depends(get_db),
):

    if all(v is None for v in (spo2_min, hr_min, temp_max)):
        raise HTTPException(
            status_code=422, detail="Provide at least one threshold parameter."
        )

    payload = decode_access_token(token)
    if payload.get("role") != "caregiver":
        raise HTTPException(status_code=403, detail="Caregivers only.")

    caregiver = crud.get_caregiver_by_id(db, payload["sub"])
    if not caregiver:
        raise HTTPException(status_code=404, detail="Caregiver not found.")

    return crud.get_patients_below_threshold(
        db,
        caregiver_id=caregiver.caregiver_id,
        spo2_min=spo2_min,
        hr_min=hr_min,
        temp_max=temp_max,
    )


# ==========ADD PATIENT TO CAREGIVER==============
@router.post("/{patient_id}/assign", status_code=status.HTTP_204_NO_CONTENT)
def assign_patient(
    patient_id: int,
    token: str = Depends(caregiver_oauth2_scheme),
    db: Session = Depends(get_db),
):

    payload = decode_access_token(token)
    if payload.get("role") != "caregiver":
        raise HTTPException(status_code=403, detail="Caregivers only.")
    caregiver = crud.get_caregiver_by_id(db, int(payload["sub"]))
    if not caregiver:
        raise HTTPException(status_code=404, detail="Caregiver not found.")
    try:
        crud.assign_patient_to_caregiver(db, caregiver.caregiver_id, patient_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Patient not found.")


# ================GET PATIENTS UNDER CAREGIVER===============
@router.get("", response_model=list[schemas.PatientOut])
@router.get("/", response_model=list[schemas.PatientOut])
def get_my_patients(
    request: Request,
    db: Session = Depends(get_db),
):
    # Read token from header or cookie
    token = None
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    else:
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_access_token(token)
    if payload.get("role") != "caregiver":
        raise HTTPException(status_code=403, detail="Caregivers only.")
    caregiver = crud.get_caregiver_by_id(db, int(payload["sub"]))
    if not caregiver:
        raise HTTPException(status_code=404, detail="Caregiver not found.")
    return crud.get_patients_by_caregiver(db, caregiver.caregiver_id)


# ================GET PATIENTS INFO BY ID===============
@router.get(
    "/get_patient_info/{patient_id}",
    response_model=schemas.PatientOut,
    status_code=status.HTTP_200_OK,
)
def get_patient(
    request: Request,
    patient_id: int,
    db: Session = Depends(get_db),
):
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        payload = decode_access_token(access_token)
        role = payload.get("role")
        user_id = payload.get("sub")

        if role == "patient" and int(user_id) != patient_id:
            raise HTTPException(
                status_code=403, detail="You can only view your own information."
            )

        if role not in ("caregiver", "patient"):
            raise HTTPException(status_code=403, detail="Invalid role.")

        patient = crud.get_patient_by_id(db, patient_id)

        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found.")

        relatives = crud.get_patient_relatives(db, patient.patient_id)
        patient.relatives = relatives

        return patient

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"crash in get_patient: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


# ================GET PATIENT ALERTS===============


@router.get("/alerts", response_model=list[schemas.AlertOut])
def get_alerts(
    request: Request,
    db: Session = Depends(get_db),
):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        payload = decode_access_token(access_token)
        if payload.get("role") != "caregiver":
            raise HTTPException(status_code=403, detail="Caregivers only.")

        caregiver = crud.get_caregiver_by_id(db, int(payload["sub"]))
        if not caregiver:
            raise HTTPException(status_code=404, detail="Caregiver not found.")

        patient_ids = [p.patient_id for p in caregiver.patients]
        if not patient_ids:
            return []

        results = (
            db.query(
                models.Alert,
                models.Person.first_name,
                models.Person.last_name,
                models.Person.personnummer,
            )
            .join(
                models.PatientAccount,
                models.Alert.patient_id == models.PatientAccount.patient_id,
            )
            .join(
                models.Person,
                models.PatientAccount.person_id == models.Person.person_id,
            )
            .filter(
                models.Alert.patient_id.in_(patient_ids),
                models.Alert.acknowledged == False,
            )
            .order_by(models.Alert.triggered_at.desc())
            .all()
        )

        alerts_with_info = []
        for alert, first_name, last_name, personnummer in results:
            alert_dict = {
                "alert_id": alert.alert_id,
                "patient_id": alert.patient_id,
                "measurement_id": alert.measurement_id,
                "alert_type": alert.alert_type,
                "severity": alert.severity,
                "message": alert.message,
                "triggered_at": alert.triggered_at,
                "acknowledged": alert.acknowledged,
                "notified": alert.notified,
                "first_name": first_name,
                "last_name": last_name,
                "personnummer": personnummer,
            }
            alerts_with_info.append(alert_dict)

        return alerts_with_info

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"crash in /alerts: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.patch("/alerts/{alert_id}/acknowledge", status_code=status.HTTP_200_OK)
def acknowledge_alert(
    alert_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        payload = decode_access_token(access_token)
        if payload.get("role") != "caregiver":
            raise HTTPException(status_code=403, detail="Caregivers only.")

        caregiver = crud.get_caregiver_by_id(db, int(payload["sub"]))
        if not caregiver:
            raise HTTPException(status_code=404, detail="Caregiver not found.")

        alert = crud.acknowledge_alert(db, alert_id, caregiver.caregiver_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found.")

        return {"message": "Alert acknowledged"}

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"crash in acknowledge_alert: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
