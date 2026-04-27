import jwt
import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone



load_dotenv(Path(__file__).resolve().parent.parent.parent / "Subscriber" / ".env")
KEY = os.get_env("SECRET_KEY")

if not KEY:
    raise ValueError("Key is not set")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

#Generate token
def create_access_token(
    data: dict,
    expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES
):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, KEY, algorithm=ALGORITHM)
# Decode token
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
