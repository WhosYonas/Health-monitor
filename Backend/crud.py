from sqlalchemy.orm import Session
import models
import schemas

def get_user(db: Session, person_id: int):
    return db.query(models.Person).filter(models.Person.id == person_id).first()

def get_user_by_phone(db: Session, phone_number: str):
    return db.query(models.Person).filter(models.Person.phone_number == phone_number).first()

def get_user_by_personal_number(db: Session, personal_number: str):
    return db.query(models.Person).join(models.Account).filter(models.Account.personal_number == personal_number).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Person).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    name_parts = user.full_name.split(" ", 1)
    f_name = name_parts[0]
    l_name = name_parts[1] if len(name_parts) > 1 else ""

    db_person = models.Person(
        first_name=f_name,
        last_name=l_name,
        phone_number=user.phone_number,  
        title=user.role          
    )
    db.add(db_person)
    db.commit()
    db.refresh(db_person)

    db_account = models.Account(
        personal_number=user.personal_number, 
        password_hash=user.password,      
        person_id=db_person.id
    )
    db.add(db_account)
    db.commit()
    
    return db_person

def delete_user(db: Session, person_id: int):
    db_user = db.query(models.Person).filter(models.Person.id == person_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def create_device(db: Session, person_id: int):
    db_device = models.Device(person_id=person_id)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def create_measurement(db: Session, device_id: int, oxygen: int, heart_rate: int, temp: float):
    db_measurement = models.Measurement(
        device_id=device_id,
        blood_oxygen=oxygen,
        heart_rate=heart_rate,
        temperature=temp
    )
    db.add(db_measurement)
    db.commit()
    db.refresh(db_measurement)
    return db_measurement

def get_measurements_by_device(db: Session, device_id: int, limit: int = 100):
    return db.query(models.Measurement).filter(models.Measurement.device_id == device_id).order_by(models.Measurement.time.desc()).limit(limit).all()

def get_account_by_personnummer(db: Session, personnummer: str):
    return (
        db.query(models.Account)
        .join(models.Person, models.Account.person_id == models.Person.person_id)
        .filter(models.Person.personnummer == personnummer)
        .first()
    )
def create_account(db: Session, user: schemas.UserCreate, hashed_password: str):
    # First create the Person
    db_person = models.Person(
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        personnummer=user.personnummer,
        role=user.role,
    )
    db.add(db_person)
    db.flush()  

    db_account = models.Account(
        username_id=user.username_id,
        password_hashed=hashed_password,
        person_id=db_person.person_id,
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_person)
    return db_person