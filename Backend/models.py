from sqlalchemy import Column, Integer, ForeignKey, String, TIMESTAMP, text, Numeric
from sqlalchemy.orm import relationship
from database import Base

class Person(Base):
    __tablename__ = "person"

    person_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(500))
    last_name = Column(String(500))
    phone_number = Column(String(500))
    personnummer = Column(String(500), unique=True, nullable=False)
    role = Column(String(500), nullable=False)  # 'patient' or 'caregiver'

    account = relationship("Account", back_populates="owner", uselist=False)
    patient = relationship("Patient", back_populates="person", uselist=False)
    caregiver = relationship("Caregiver", back_populates="person", uselist=False)


class Account(Base):
    __tablename__ = "account"

    account_id = Column(Integer, primary_key=True, index=True)
    username_id = Column(String(500), unique=True)
    password_hashed = Column(String(500), nullable=False)
    person_id = Column(Integer, ForeignKey("person.person_id", ondelete="CASCADE"), nullable=False, unique=True)

    owner = relationship("Person", back_populates="account")


class Caregiver(Base):
    __tablename__ = "caregiver"

    caregiver_id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer, ForeignKey("person.person_id", ondelete="CASCADE"), unique=True)

    person = relationship("Person", back_populates="caregiver")


class Patient(Base):
    __tablename__ = "patient"

    patient_id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer, ForeignKey("person.person_id", ondelete="CASCADE"), nullable=False, unique=True)

    person = relationship("Person", back_populates="patient")
    devices = relationship("Device", back_populates="patient", cascade="all, delete")
    relatives = relationship("Relatives", back_populates="patient", cascade="all, delete")


class Device(Base):
    __tablename__ = "device"

    device_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient.patient_id", ondelete="CASCADE"), nullable=False)

    patient = relationship("Patient", back_populates="devices")
    measurements = relationship("Measurement", back_populates="device", cascade="all, delete")


class Measurement(Base):
    __tablename__ = "measurement"

    measurement_id = Column(Integer, primary_key=True, index=True)
    time = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"), nullable=False)
    blood_oxygen = Column(Numeric(5, 2))
    heart_rate = Column(Integer)
    temperature = Column(Numeric(4, 2))
    device_id = Column(Integer, ForeignKey("device.device_id", ondelete="CASCADE"), nullable=False)

    device = relationship("Device", back_populates="measurements")


class Relatives(Base):
    __tablename__ = "relatives"

    relatives_id = Column(Integer, primary_key=True, index=True)
    relative_fullname = Column(String(500))
    relative_phone_number = Column(String(500))
    patient_id = Column(Integer, ForeignKey("patient.patient_id", ondelete="CASCADE"), nullable=False)

    patient = relationship("Patient", back_populates="relatives")