import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

host = os.environ["DATABASE_HOST"]
port = os.environ["DATABASE_PORT"]
name = os.environ["DATABASE_NAME"]
user = os.environ["DATABASE_USER"]
password = os.environ["DATABASE_PASSWORD"]

dsn = f"postgresql://{user}:{password}@{host}:{port}/{name}"

engine = create_engine(dsn)
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