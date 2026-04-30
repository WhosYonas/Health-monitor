from sqlalchemy import (
    Column, Integer, ForeignKey, String,
    TIMESTAMP, Boolean, Text, Numeric, text
)
from sqlalchemy.orm import relationship
from database import Base


from sqlalchemy import Table

caregiver_patient = Table(
    "caregiver_patient",
    Base.metadata,
    Column("caregiver_id", Integer, ForeignKey("caregiver_account.caregiver_id", ondelete="CASCADE"), primary_key=True),
    Column("patient_id",   Integer, ForeignKey("patient_account.patient_id",   ondelete="CASCADE"), primary_key=True),
)


class Person(Base):
    __tablename__ = "person"

    person_id    = Column(Integer, primary_key=True, index=True)
    first_name   = Column(String(100), nullable=False)
    last_name    = Column(String(100), nullable=False)
    phone_number = Column(String(20))
    personnummer = Column(String(12), unique=True, nullable=False)

    caregiver_account = relationship("CaregiverAccount", back_populates="person", uselist=False)
    patient_account   = relationship("PatientAccount",   back_populates="person", uselist=False)


class CaregiverAccount(Base):
    __tablename__ = "caregiver_account"

    caregiver_id  = Column(Integer, primary_key=True, index=True)
    person_id     = Column(Integer, ForeignKey("person.person_id", ondelete="CASCADE"), nullable=False, unique=True)
    username      = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at    = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"), nullable=False)

    person   = relationship("Person", back_populates="caregiver_account")
    patients = relationship("PatientAccount", secondary=caregiver_patient, back_populates="caregivers")


class PatientAccount(Base):
    __tablename__ = "patient_account"

    patient_id    = Column(Integer, primary_key=True, index=True)
    person_id     = Column(Integer, ForeignKey("person.person_id", ondelete="CASCADE"), nullable=False, unique=True)
    username      = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at    = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"), nullable=False)

    person    = relationship("Person", back_populates="patient_account")
    caregivers = relationship("CaregiverAccount", secondary=caregiver_patient, back_populates="patients")
    devices   = relationship("Device",   back_populates="patient", cascade="all, delete")
    relatives = relationship("Relative", back_populates="patient", cascade="all, delete")


class Device(Base):
    __tablename__ = "device"

    device_id     = Column(Integer, primary_key=True, index=True)
    patient_id    = Column(Integer, ForeignKey("patient_account.patient_id", ondelete="CASCADE"), nullable=False)
    device_uid    = Column(String(100), unique=True, nullable=False)  # hardware/MQTT identifier
    registered_at = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"), nullable=False)
    is_active     = Column(Boolean, nullable=False, default=True)

    patient      = relationship("PatientAccount", back_populates="devices")
    measurements = relationship("Measurement", back_populates="device", cascade="all, delete")


class Measurement(Base):
    __tablename__ = "measurement"

    measurement_id = Column(Integer, primary_key=True, index=True)
    device_id      = Column(Integer, ForeignKey("device.device_id", ondelete="CASCADE"), nullable=False)
    recorded_at    = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"), nullable=False)
    blood_oxygen   = Column(Numeric(5, 2))
    heart_rate     = Column(Integer)
    temperature    = Column(Numeric(4, 2))

    device = relationship("Device", back_populates="measurements")
    alerts = relationship("Alert", back_populates="measurement", cascade="all, delete")


class Relative(Base):
    __tablename__ = "relative"

    relative_id  = Column(Integer, primary_key=True, index=True)
    patient_id   = Column(Integer, ForeignKey("patient_account.patient_id", ondelete="CASCADE"), nullable=False)
    full_name    = Column(String(200), nullable=False)
    phone_number = Column(String(20))

    patient = relationship("PatientAccount", back_populates="relatives")


class Alert(Base):
    __tablename__ = "alert"

    alert_id        = Column(Integer, primary_key=True, index=True)
    measurement_id  = Column(Integer, ForeignKey("measurement.measurement_id", ondelete="CASCADE"), nullable=False)
    patient_id      = Column(Integer, ForeignKey("patient_account.patient_id", ondelete="CASCADE"), nullable=False)
    alert_type      = Column(String(50),  nullable=False)   # 'heart_rate' | 'blood_oxygen' | 'temperature'
    severity        = Column(String(20),  nullable=False, default="warning")  # 'warning' | 'critical'
    message         = Column(Text)
    triggered_at    = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"), nullable=False)
    acknowledged    = Column(Boolean, nullable=False, default=False)
    acknowledged_by = Column(Integer, ForeignKey("caregiver_account.caregiver_id", ondelete="SET NULL"), nullable=True)

    measurement = relationship("Measurement", back_populates="alerts")