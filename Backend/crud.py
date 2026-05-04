from sqlalchemy.orm import Session
import models
import schemas
import bcrypt



def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    password_bytes = plain.encode("utf-8")[:72]
    return bcrypt.checkpw(password_bytes, hashed.encode("utf-8"))

#=================CAREGIVER========================

def get_caregiver_by_personnummer(db: Session, personnummer: str) -> models.CaregiverAccount | None:
    return (
        db.query(models.CaregiverAccount)
        .join(models.Person)
        .filter(models.Person.personnummer == personnummer)
        .first()
    )

def get_caregiver_by_username(db: Session, username: str) -> models.CaregiverAccount | None:
    return db.query(models.CaregiverAccount).filter(models.CaregiverAccount.username == username).first()


def get_caregiver_by_id(db: Session, caregiver_id: int) -> models.CaregiverAccount | None:
    return db.query(models.CaregiverAccount).filter_by(caregiver_id=caregiver_id).first()


def create_caregiver(db: Session, data: schemas.CaregiverCreate) -> models.CaregiverAccount:
    person = models.Person(
        first_name=data.first_name,
        last_name=data.last_name,
        phone_number=data.phone_number,
        personnummer=data.personnummer,
    )
    db.add(person)
    db.flush()

    account = models.CaregiverAccount(
        person_id=person.person_id,
        username=data.username,
        password_hash=hash_password(data.password),
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


#=================PATIENT========================

def get_patient_by_personnummer(db: Session, personnummer: str) -> models.PatientAccount | None:
    return (
        db.query(models.PatientAccount)
        .join(models.Person)
        .filter(models.Person.personnummer == personnummer)
        .first()
    )

def get_patient_by_id(db: Session, patient_id: int) -> models.PatientAccount | None:
    return db.query(models.PatientAccount).filter_by(patient_id=patient_id).first()

def create_patient(db: Session, data: schemas.PatientCreate) -> models.PatientAccount:
    person = models.Person(
        first_name=data.first_name,
        last_name=data.last_name,
        phone_number=data.phone_number,
        personnummer=data.personnummer,
    )
    db.add(person)
    db.flush()

    account = models.PatientAccount(
        person_id=person.person_id,
        password_hash=hash_password(data.password),
        critical_level=data.critical_level
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


#===============CAREGIVER<->PATIENT======================

def assign_patient_to_caregiver(db: Session, caregiver_id: int, patient_id: int) -> None:
    caregiver = db.query(models.CaregiverAccount).filter_by(caregiver_id=caregiver_id).first()
    patient   = db.query(models.PatientAccount).filter_by(patient_id=patient_id).first()
    if not caregiver or not patient:
        raise ValueError("Caregiver or patient not found")
    if patient not in caregiver.patients:
        caregiver.patients.append(patient)
        db.commit()

def get_patients_by_caregiver(db: Session, caregiver_id: int) -> list[models.PatientAccount]:
    caregiver = db.query(models.CaregiverAccount).filter_by(caregiver_id=caregiver_id).first()
    if not caregiver:
        return []
    return caregiver.patients

#================DEVICE======================

def create_device(db: Session, patient_id: int, device_uid: str) -> models.Device:
    device = models.Device(patient_id=patient_id, device_uid=device_uid)
    db.add(device)
    db.commit()
    db.refresh(device)
    return device


def get_devices_by_patient(db: Session, patient_id: int) -> list[models.Device]:
    return db.query(models.Device).filter_by(patient_id=patient_id).all()


#============MEASUREMENT====================

def create_measurement(
    db: Session,
    device_id: int,
    blood_oxygen: float,
    heart_rate: int,
    temperature: float,
) -> models.Measurement:
    m = models.Measurement(
        device_id=device_id,
        blood_oxygen=blood_oxygen,
        heart_rate=heart_rate,
        temperature=temperature,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


def get_measurements_by_device(db: Session, device_id: int, limit: int = 100) -> list[models.Measurement]:
    return (
        db.query(models.Measurement)
        .filter_by(device_id=device_id)
        .order_by(models.Measurement.recorded_at.desc())
        .limit(limit)
        .all()
    )


#================RELATIVE=================

def create_relative(db: Session, patient_id: int, data: schemas.RelativeCreate) -> models.Relative:
    rel = models.Relative(patient_id=patient_id, full_name=data.full_name, phone_number=data.phone_number)
    db.add(rel)
    db.commit()
    db.refresh(rel)
    return rel


#=============ALERT===========

def create_alert(
    db: Session,
    measurement_id: int,
    patient_id: int,
    alert_type: str,
    severity: str,
    message: str,
) -> models.Alert:
    alert = models.Alert(
        measurement_id=measurement_id,
        patient_id=patient_id,
        alert_type=alert_type,
        severity=severity,
        message=message,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def acknowledge_alert(db: Session, alert_id: int, caregiver_id: int) -> models.Alert | None:
    alert = db.query(models.Alert).filter_by(alert_id=alert_id).first()
    if alert:
        alert.acknowledged    = True
        alert.acknowledged_by = caregiver_id
        db.commit()
        db.refresh(alert)
    return alert


def get_unacknowledged_alerts_by_patient(db: Session, patient_id: int) -> list[models.Alert]:
    return (
        db.query(models.Alert)
        .filter_by(patient_id=patient_id, acknowledged=False)
        .order_by(models.Alert.triggered_at.desc())
        .all()
    )



#============PATIENTS BELOW THRESHOLD===========

def get_patients_below_threshold(
    db: Session,
    caregiver_id: int,
    spo2_min:  float | None = None,
    hr_min:    int   | None = None,
    temp_max:  float | None = None,
) -> list[dict]:
    caregiver = db.query(models.CaregiverAccount).filter_by(caregiver_id=caregiver_id).first()
    if not caregiver or not caregiver.patients:
        return []

    results = []
    for patient in caregiver.patients:
        # Get latest measurement across all patient devices
        latest = (
            db.query(models.Measurement)
            .join(models.Device)
            .filter(models.Device.patient_id == patient.patient_id)
            .order_by(models.Measurement.recorded_at.desc())
            .first()
        )

        if not latest:
            continue

        breaches = False
        if spo2_min is not None and latest.blood_oxygen is not None:
            if latest.blood_oxygen < spo2_min:
                breaches = True
        if hr_min is not None and latest.heart_rate is not None:
            if latest.heart_rate < hr_min:
                breaches = True
        if temp_max is not None and latest.temperature is not None:
            if latest.temperature > temp_max:
                breaches = True

        if breaches:
            results.append({
                "patient_id": patient.patient_id,
                "username":   patient.username,
                "vitals": {
                    "blood_oxygen": float(latest.blood_oxygen) if latest.blood_oxygen else None,
                    "heart_rate":   latest.heart_rate,
                    "temperature":  float(latest.temperature) if latest.temperature else None,
                    "recorded_at":  latest.recorded_at,
                },
            })

    return results


#=====UPDATE PATIENT======
def update_patient(db: Session, patient_id: int, data: schemas.PatientUpdate) -> models.PatientAccount | None:
    patient = db.query(models.PatientAccount).filter_by(patient_id=patient_id).first()
    if not patient:
        return None

    person = patient.person
    if data.first_name is not None:
        person.first_name = data.first_name
    if data.last_name is not None:
        person.last_name = data.last_name
    if data.phone_number is not None:
        person.phone_number = data.phone_number
    if data.personnummer is not None:
        person.personnummer = data.personnummer

    if data.password is not None:
        patient.password_hash = hash_password(data.password)

    db.commit()
    db.refresh(patient)
    return patient

#===========DELETE PATIENT==========

def delete_patient(db: Session, patient_id: int) -> bool:
    patient = db.query(models.PatientAccount).filter_by(patient_id=patient_id).first()
    if not patient:
        return False
    person = patient.person
    db.delete(patient)
    db.flush()      
    db.delete(person)
    db.commit()
    return True