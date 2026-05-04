from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
import crud, schemas, models
from .auth import caregiver_oauth2_scheme, decode_access_token

router = APIRouter()


@router.get("/below-threshold", response_model=list[schemas.PatientBelowThreshold])
def get_patients_below_threshold(
    spo2_min:  Optional[float] = 95.0,
    hr_min:    Optional[int]   = 50,
    temp_max:  Optional[float] = 38.0,
    token: str = Depends(caregiver_oauth2_scheme),
    db: Session = Depends(get_db),
):
    if all(v is None for v in (spo2_min, hr_min, temp_max)):
        raise HTTPException(status_code=422, detail="Provide at least one threshold parameter.")

    payload = decode_access_token(token)
    if payload.get("role") != "caregiver":
        raise HTTPException(status_code=403, detail="Caregivers only.")

    caregiver = crud.get_caregiver_by_personnummer(db, payload["sub"])
    if not caregiver:
        raise HTTPException(status_code=404, detail="Caregiver not found.")

    return crud.get_patients_below_threshold(
        db,
        caregiver_id=caregiver.caregiver_id,
        spo2_min=spo2_min,
        hr_min=hr_min,
        temp_max=temp_max,
    )


#==========ADD PATIENT TO CAREGIVER==============
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

#================GET PATIENTS UNDER CAREGIVER===============
@router.get("/", response_model=list[schemas.PatientOut])
def get_my_patients(
    token: str = Depends(caregiver_oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(token)
    if payload.get("role") != "caregiver":
        raise HTTPException(status_code=403, detail="Caregivers only.")
    caregiver = crud.get_caregiver_by_id(db, int(payload["sub"]))
    if not caregiver:
        raise HTTPException(status_code=404, detail="Caregiver not found.")
    return crud.get_patients_by_caregiver(db, caregiver.caregiver_id)