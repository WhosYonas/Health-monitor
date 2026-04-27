from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm  
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas, models
from Backend.database import get_db
from passlib.context import CryptContext
from .auth import create_access_token, oauth2_scheme, decode_access_token
import bcrypt

router = APIRouter()

#==================PASSWORD HASING===============
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    #Hash a password using bcrypt.
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    #Verify a password against a hash.
    password_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

#=============CREATE USER=================

@router.post("/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_account_by_personummer(db, personummer=user.personummer)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this personummer already exists."
        )

    hashed_password = hash_password(user.password)
    db_account = crud.create_account(db, user=user, hashed_password=hashed_password)
    return db_account

#==========LOGIN===============

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    #Authenticate user and return JWT access token.
    user = crud.get_account_by_personummer(db, personummer=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect personummer or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.personummer})
    return {"access_token": access_token, "token_type": "bearer"}


#===============CURRENT USER==================

@router.get("/me", response_model=schemas.User)
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    #Get currently authenticated user.
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_account_by_personummer(db, personummer=payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
