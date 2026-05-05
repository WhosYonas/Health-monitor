from typing import Union

import crud
import schemas
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.requests import Request

from database import get_db

from .auth import (
    caregiver_oauth2_scheme,
    create_access_token,
    decode_access_token,
)

router = APIRouter()


# ================REGISTER==========================


@router.post(
    "/register/caregiver",
    response_model=schemas.CaregiverOut,
    status_code=status.HTTP_201_CREATED,
)
def register_caregiver(data: schemas.CaregiverCreate, db: Session = Depends(get_db)):
    if crud.get_caregiver_by_personnummer(db, data.personnummer):
        raise HTTPException(
            status_code=409,
            detail="A caregiver account with this personnummer already exists.",
        )
    if crud.get_caregiver_by_username(db, data.username):
        raise HTTPException(status_code=409, detail="Username already taken.")
    return crud.create_caregiver(db, data)


@router.post(
    "/register/patient",
    response_model=schemas.PatientOut,
    status_code=status.HTTP_201_CREATED,
)
def register_patient(data: schemas.PatientCreate, request: Request, db: Session = Depends(get_db)):
    if crud.get_patient_by_personnummer(db, data.personnummer):
        raise HTTPException(
            status_code=409,
            detail="A patient account with this personnummer already exists.",
        )
    patient = crud.create_patient(db, data)
    
    # Auto-assign to the caregiver who registered them
    token = request.cookies.get("access_token")
    if token:
        payload = decode_access_token(token)
        if payload.get("role") == "caregiver":
            caregiver = crud.get_caregiver_by_id(db, int(payload["sub"]))
            if caregiver:
                crud.assign_patient_to_caregiver(db, caregiver.caregiver_id, patient.patient_id)
    
    return patient


# =================LOGIN==========================
@router.post("/login/caregiver", response_model=schemas.CaregiverLoginOut)
def login_caregiver(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    account = crud.get_caregiver_by_personnummer(db, form_data.username)
    if not account or not crud.verify_password(
        form_data.password, account.password_hash
    ):
        raise HTTPException(
            status_code=401, detail="Incorrect personnummer or password."
        )
    token = create_access_token(account_id=str(account.caregiver_id), role="caregiver")
    response.set_cookie(
        key="access_token",
        httponly=True,
        value=token,
        secure=True,
        samesite="lax",
        max_age=3600,
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": "caregiver",
        "user": account,
    }


@router.post("/login/patient", response_model=schemas.PatientLoginOut)
def login_patient(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    account = crud.get_patient_by_personnummer(db, form_data.username)
    if not account or not crud.verify_password(
        form_data.password, account.password_hash
    ):
        raise HTTPException(
            status_code=401, detail="Incorrect personnummer or password."
        )
    token = create_access_token(account_id=str(account.patient_id), role="patient")
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=3600,
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": "patient",
        "user": account,
    }


# ===============ME=================================


@router.get("/me", response_model=Union[schemas.CaregiverOut, schemas.PatientOut])
def get_me(request: Request, db: Session = Depends(get_db)):
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        payload = decode_access_token(access_token)
        role = payload.get("role")
        user_id = payload.get("sub")

        if role == "caregiver":
            account = crud.get_caregiver_by_id(db, user_id)
            if not account:
                raise HTTPException(status_code=404, detail="Caregiver not found")
            account.role = "caregiver"
            return account

        elif role == "patient":
            account = crud.get_patient_by_id(db, int(user_id))
            if not account:
                raise HTTPException(status_code=404, detail="Patient not found")
            account.role = "patient"
            return account

        raise HTTPException(status_code=400, detail="Invalid role in token")

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"crash in /me: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


# @router.get("/me/caregiver", response_model=schemas.CaregiverOut)
# def get_me_caregiver(request: Request, db: Session = Depends(get_db)):

#     access_token = request.cookies.get("access_token")

#     if not access_token:
#         raise HTTPException(status_code=401, detail="Not logged in")

#     try:
#         payload = decode_access_token(access_token)

#         if payload.get("role") != "caregiver":
#             raise HTTPException(status_code=403, detail="Not a caregiver token.")

#         account = crud.get_caregiver_by_id(db, payload["sub"])
#         if not account:
#             raise HTTPException(status_code=404, detail="Caregiver not found.")

#         return account

#     except Exception:
#         raise HTTPException(status_code=500, detail="Internal server error")


# @router.get("/me/patient", response_model=schemas.PatientOut)
# def get_me_patient(request: Request, db: Session = Depends(get_db)):
#     access_token = request.cookies.get("access_token")
#     payload = decode_access_token(access_token)
#     if payload.get("role") != "patient":
#         raise HTTPException(status_code=403, detail="Not a patient token.")
#     account = crud.get_patient_by_id(db, int(payload["sub"]))
#     if not account:
#         raise HTTPException(status_code=404, detail="Patient not found.")
#     return account


# ===================UPDATE PATIENT INFO======
@router.patch("/patient/{patient_id}", response_model=schemas.PatientOut)
def update_patient(
    patient_id: int,
    data: schemas.PatientUpdate,
    token: str = Depends(caregiver_oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(token)
    if payload.get("role") != "caregiver":
        raise HTTPException(
            status_code=403, detail="Only caregivers can update patients."
        )
    patient = crud.update_patient(db, patient_id, data)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return patient


# =======DELETE PATIENT=========


@router.delete("/patient/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(
    patient_id: int,
    token: str = Depends(caregiver_oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(token)
    if payload.get("role") != "caregiver":
        raise HTTPException(
            status_code=403, detail="Only caregivers can delete patients."
        )
    deleted = crud.delete_patient(db, patient_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Patient not found.")

#=================LOGOUT==========================

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, secure=True, samesite="lax")
    return {"detail": "Successfully logged out"}
