from sqlalchemy import Column, Integer, ForeignKey, String, TIMESTAMP, text
from sqlalchemy.orm import relationship
from database import Base

class Person(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable= False)
    last_name = Column(String, nullable =False)
    phone_number = Column(String, unique = True, nullable=False)

    account = relationship("Account", back_populates= "owner")

class Account(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True, index= True)
    personummer = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable = False)
    created_at = Column(TIMESTAMP(timezone= True), server_default= text("NOW()"))
    person_id = Column(Integer, ForeignKey("users.id", ondelete= "CASCADE"), nullable=False)

    owner = relationship("Person", back_populates="account")