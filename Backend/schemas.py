from pydantic import BaseModel
from typing import Optional
from datetime import datetime


#===============PERSON======================

class PersonOut(BaseModel):
    person_id:    int
    first_name:   str
    last_name:    str
    phone_number: Optional[str]
    personnummer: str

    class Config:
        from_attributes = True


#===============CAREGIVER======================

class CaregiverCreate(BaseModel):
    first_name:   str
    last_name:    str
    phone_number: Optional[str] = None
    personnummer: str
    username:     str
    password:     str

class CaregiverOut(BaseModel):
    caregiver_id: int
    username:     str
    person:       PersonOut

    class Config:
        from_attributes = True

class CaregiverLogin(BaseModel):
    personnummer: str
    password:     str

class CaregiverLoginOut(BaseModel):
    access_token: str
    token_type:   str
    role:         str
    user:         CaregiverOut

    class Config:
        from_attributes = True


#===============PATIENT======================

class PatientCreate(BaseModel):
    first_name:   str
    last_name:    str
    phone_number: Optional[str] = None
    personnummer: str
    username:     str
    password:     str

class PatientOut(BaseModel):
    patient_id: int
    username:   str
    person:     PersonOut

    class Config:
        from_attributes = True

class PatientLogin(BaseModel):
    personnummer: str
    password:     str

class PatientLoginOut(BaseModel):
    access_token: str
    token_type:   str
    role:         str
    user:         PatientOut

    class Config:
        from_attributes = True

#================DEVICE======================

class DeviceCreate(BaseModel):
    device_uid: str  


class DeviceOut(BaseModel):
    device_id:  int
    patient_id: int
    device_uid: str
    is_active:  bool

    class Config:
        from_attributes = True


#============MEASUREMENT====================

class MeasurementOut(BaseModel):
    measurement_id: int
    device_id:      int
    recorded_at:    datetime
    blood_oxygen:   Optional[float]
    heart_rate:     Optional[int]
    temperature:    Optional[float]

    class Config:
        from_attributes = True


#================RELATIVE=================

class RelativeCreate(BaseModel):
    full_name:    str
    phone_number: Optional[str] = None


class RelativeOut(RelativeCreate):
    relative_id: int
    patient_id:  int

    class Config:
        from_attributes = True


#=============ALERT===========

class AlertOut(BaseModel):
    alert_id:        int
    measurement_id:  int
    patient_id:      int
    alert_type:      str
    severity:        str
    message:         Optional[str]
    triggered_at:    datetime
    acknowledged:    bool
    acknowledged_by: Optional[int]

    class Config:
        from_attributes = True


#============PATIENTS BELOW THRESHOLD=========

class LatestVitals(BaseModel):
    blood_oxygen: Optional[float]
    heart_rate:   Optional[int]
    temperature:  Optional[float]
    recorded_at:  Optional[datetime]

    class Config:
        from_attributes = True


class PatientBelowThreshold(BaseModel):
    patient_id: int
    username:   str
    person:     PersonOut
    vitals:     Optional[LatestVitals]

    class Config:
        from_attributes = True

#=========PATIENT UPDATE===========
class PatientUpdate(BaseModel):
    first_name:   Optional[str] = None
    last_name:    Optional[str] = None
    phone_number: Optional[str] = None
    personnummer: Optional[str] = None
    username:     Optional[str] = None
    password:     Optional[str] = None
