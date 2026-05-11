from typing import Optional

import crud
import models
import schemas
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from database import get_db

from .auth import caregiver_oauth2_scheme, decode_access_token

router = APIRouter()

@router.post("/health_history", response_model=list[schemas.MeasurementHistoryOut])
def get_patient_health_history(
    data: schemas.HealthDataRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        payload = decode_access_token(access_token)
        if payload.get("role") not in ("caregiver", "patient"):
            raise HTTPException(status_code=403, detail="Invalid role.")

        patient = crud.get_patient_by_personnummer(db, data.person_number)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found.")

        history = crud.get_health_history(db, patient.patient_id)
        return history

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"crash in /health_history: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")