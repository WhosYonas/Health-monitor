from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm  
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas, models
from database import get_db
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

@router.post("/", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_account_by_personnummer(db, personnummer=user.personnummer)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this personnummer already exists."
        )

    hashed_password = hash_password(user.password)
    db_account = crud.create_account(db, user=user, hashed_password=hashed_password)
    return db_account

#==========LOGIN===============


@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_account_by_personnummer(db, personnummer=form_data.username)
    if not user or not verify_password(form_data.password, user.password_hashed):
        raise HTTPException(status_code=401, detail="Incorrect personnummer or password")
    
    access_token = create_access_token(data={"sub": user.owner.personnummer})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,      
        secure=True,        
        samesite="lax",     
        max_age=3600        
    )
    return {"message": "Login successful"}
#===============CURRENT USER==================

@router.get("/me", response_model=schemas.UserOut)
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    #Get currently authenticated user.
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_account_by_personnummer(db, personnummer=payload.get("sub"))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.owner  
