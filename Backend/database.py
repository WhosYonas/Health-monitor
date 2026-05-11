import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

host = os.environ.get("DATABASE_HOST", "localhost")
port = os.environ.get("DATABASE_PORT", "5432")
name = os.environ.get("DATABASE_NAME", "HealthMonitorDB")
user = os.environ.get("DATABASE_USER", "postgres")
password = os.environ.get("DATABASE_PASSWORD", "postgres")

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