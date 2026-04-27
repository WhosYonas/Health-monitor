from pydantic import BaseModel

class UserBase(BaseModel):
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str  
    phone_number: str
    personal_number: str

class User(UserBase):
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True

class PatientBase(BaseModel):
    date_of_birth: str
    medical_id: str

class PatientCreate(PatientBase):
    user_id: int  

class Patient(PatientBase):
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True

class PatientLogin(BaseModel):
    password: str
    personalnumber: int

class HealthWorkerBase(BaseModel): 
    email: str
    date_of_birth: str
    worker_id: str

class HealthWorkerCreate(HealthWorkerBase):
    worker_id: str

class HealthWorker(HealthWorkerBase):
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True

class HealthWorkerLogin(BaseModel):
    password: str
    personalnumber: int