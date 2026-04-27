import jwt
import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone

load_dotenv(Path(__file__).resolve().parent.parent.parent / "Subscriber" / ".env")
KEY = os.getenv("SECRET_KEY")

if not KEY:
    raise ValueError("SECRET_KEY is not set in environment")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Separate token URLs so frontend can hit the right login endpoint
caregiver_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login/caregiver")
patient_oauth2_scheme   = OAuth2PasswordBearer(tokenUrl="users/login/patient")


def create_access_token(personnummer: str, role: str, expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_delta)
    payload = {
        "sub":  personnummer,
        "role": role,          
        "exp":  expire,
    }
    return jwt.encode(payload, KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Returns the full payload dict with 'sub' (personnummer) and 'role'."""
    try:
        payload = jwt.decode(token, KEY, algorithms=[ALGORITHM])
        if not payload.get("sub"):
            raise HTTPException(status_code=401, detail="Invalid token: missing subject")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")