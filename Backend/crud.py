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


def get_patient_by_username(db: Session, username: str) -> models.PatientAccount | None:
    return db.query(models.PatientAccount).filter(models.PatientAccount.username == username).first()


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
        username=data.username,
        password_hash=hash_password(data.password),
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