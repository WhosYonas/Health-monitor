from pydantic import BaseModel
from typing import Optional

#Person / Account 

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    personnummer: str
    role: str  
    username_id: str
    password: str  

class UserOut(BaseModel):
    person_id: int
    first_name: Optional[str]
    last_name: Optional[str]
    phone_number: Optional[str]
    personnummer: str
    role: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    personnummer: str
    password: str

#Device

class DeviceOut(BaseModel):
    device_id: int
    patient_id: int

    class Config:
        from_attributes = True

#Measurement

class MeasurementOut(BaseModel):
    measurement_id: int
    time: str
    blood_oxygen: Optional[float]
    heart_rate: Optional[int]
    temperature: Optional[float]
    device_id: int

    class Config:
        from_attributes = True

#Relatives

class RelativeCreate(BaseModel):
    relative_fullname: str
    relative_phone_number: str
    patient_id: int

class RelativeOut(RelativeCreate):
    relatives_id: int

    class Config:
        from_attributes = True