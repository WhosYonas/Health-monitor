from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.settings import db as db_url
from dotenv import load_dotenv
from pathlib import Path
import os

# ---------------- Database Setup ----------------
load_dotenv(Path(__file__).resolve().parent.parent / "Subscriber" / ".env")

engine = create_engine(db_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()