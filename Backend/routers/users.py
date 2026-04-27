from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
import crud, schemas
from .auth import (
    create_access_token,
    decode_access_token,
    caregiver_oauth2_scheme,
    patient_oauth2_scheme,
)

router = APIRouter()


#================REGISTER==========================

@router.post("/register/caregiver", response_model=schemas.CaregiverOut, status_code=status.HTTP_201_CREATED)
def register_caregiver(data: schemas.CaregiverCreate, db: Session = Depends(get_db)):
    if crud.get_caregiver_by_personnummer(db, data.personnummer):
        raise HTTPException(status_code=409, detail="A caregiver account with this personnummer already exists.")
    if crud.get_caregiver_by_username(db, data.username):
        raise HTTPException(status_code=409, detail="Username already taken.")
    return crud.create_caregiver(db, data)


@router.post("/register/patient", response_model=schemas.PatientOut, status_code=status.HTTP_201_CREATED)
def register_patient(data: schemas.PatientCreate, db: Session = Depends(get_db)):
    if crud.get_patient_by_personnummer(db, data.personnummer):
        raise HTTPException(status_code=409, detail="A patient account with this personnummer already exists.")
    if crud.get_patient_by_username(db, data.username):
        raise HTTPException(status_code=409, detail="Username already taken.")
    return crud.create_patient(db, data)


#=================LOGIN==========================
@router.post("/login/caregiver")
def login_caregiver(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    account = crud.get_caregiver_by_personnummer(db, form_data.username)
    if not account or not crud.verify_password(form_data.password, account.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect personnummer or password.")

    token = create_access_token(personnummer=account.person.personnummer, role="caregiver")
    response.set_cookie(key="access_token", value=token, httponly=True, secure=True, samesite="lax", max_age=3600)
    
    return {"access_token": token, "token_type": "bearer", "role": "caregiver"}

@router.post("/login/patient")
def login_patient(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    account = crud.get_patient_by_personnummer(db, form_data.username)
    if not account or not crud.verify_password(form_data.password, account.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect personnummer or password.")

    token = create_access_token(personnummer=account.person.personnummer, role="patient")
    response.set_cookie(key="access_token", value=token, httponly=True, secure=True, samesite="lax", max_age=3600)
    return {"access_token": token, "token_type": "bearer", "role": "patient"}


#===============ME=================================

@router.get("/me/caregiver", response_model=schemas.CaregiverOut)
def get_me_caregiver(token: str = Depends(caregiver_oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload.get("role") != "caregiver":
        raise HTTPException(status_code=403, detail="Not a caregiver token.")
    account = crud.get_caregiver_by_personnummer(db, payload["sub"])
    if not account:
        raise HTTPException(status_code=404, detail="Caregiver not found.")
    return account


@router.get("/me/patient", response_model=schemas.PatientOut)
def get_me_patient(token: str = Depends(patient_oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload.get("role") != "patient":
        raise HTTPException(status_code=403, detail="Not a patient token.")
    account = crud.get_patient_by_personnummer(db, payload["sub"])
    if not account:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return account