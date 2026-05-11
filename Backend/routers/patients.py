from typing import Optional

import crud
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
    # token: str = Depends(caregiver_oauth2_scheme),
    db: Session = Depends(get_db),
):

    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        payload = decode_access_token(access_token)
        role = payload.get("role")
        user_id = payload.get("sub")

        if role != "caregiver":
            raise HTTPException(status_code=403, detail="Caregivers only.")

        patient = crud.get_patient_by_id(db, patient_id)

        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found.")

        relatives = crud.get_patient_relatives(db, patient.patient_id)

        patient.relatives = relatives

        return patient

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"crash in /me: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
