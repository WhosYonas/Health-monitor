from sqlalchemy import Column, Integer, ForeignKey, String, TIMESTAMP, text, Double
from sqlalchemy.orm import relationship
from database import Base

class Person(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable= False)
    last_name = Column(String, nullable =False)
    phone_number = Column(String, unique = True, nullable=False)
    title = Column(String, nullable=False)

    account = relationship("Account", back_populates= "owner")
    device = relationship("Device", back_populates = "person")

class Account(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True, index= True)
    personal_number = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable = False)
    created_at = Column(TIMESTAMP(timezone= True), server_default= text("NOW()"))
    person_id = Column(Integer, ForeignKey("users.id", ondelete= "CASCADE"), nullable=False)

    owner = relationship("Person", back_populates="account")

class Device(Base):
    __tablename__ = "device"

    device_id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer, ForeignKey("users.id"))
    person = relationship("Person", back_populates="device")
    measurements = relationship("Measurement", back_populates="device", cascade="all, delete")

class Measurement(Base):
    __tablename__ = "measurement"

    measurement_id = Column(Integer, primary_key=True, index=True)
    time = Column(TIMESTAMP(timezone=True), server_default= text("NOW()"))
    blood_oxygen = Column(Integer, nullable=False)  
    heart_rate = Column(Integer, nullable=False)
    temperature = Column(Double, nullable=False)
    device_id = Column(Integer, ForeignKey("device.device_id"), nullable=False)
    device = relationship("Device", back_populates="measurements")