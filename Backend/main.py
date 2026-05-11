from contextlib import asynccontextmanager

import crud
import models
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import patients, users, health

from database import SessionLocal, init_db

THRESHOLDS = {
    "spo2_min": 95.0,
    "hr_min": 50,
    "temp_max": 38.0,
}


def check_thresholds_job():
    """Runs every minute: checks latest measurement per patient, creates alerts."""
    db = SessionLocal()
    try:
        patients_list = db.query(models.PatientAccount).all()

        for patient in patients_list:
            latest = (
                db.query(models.Measurement)
                .join(models.Device)
                .filter(models.Device.patient_id == patient.patient_id)
                .order_by(models.Measurement.recorded_at.desc())
                .first()
            )

            if not latest:
                continue

            breaches = []
            if (
                latest.blood_oxygen is not None
                and float(latest.blood_oxygen) < THRESHOLDS["spo2_min"]
            ):
                breaches.append(("blood_oxygen", f"SpO₂ at {latest.blood_oxygen}%"))
            if (
                latest.heart_rate is not None
                and latest.heart_rate < THRESHOLDS["hr_min"]
            ):
                breaches.append(
                    ("heart_rate", f"Heart rate at {latest.heart_rate} bpm")
                )
            if (
                latest.temperature is not None
                and float(latest.temperature) > THRESHOLDS["temp_max"]
            ):
                breaches.append(("temperature", f"Temp at {latest.temperature}°C"))

            for alert_type, message in breaches:
                existing = (
                    db.query(models.Alert)
                    .filter_by(
                        patient_id=patient.patient_id,
                        alert_type=alert_type,
                        acknowledged=False,
                    )
                    .first()
                )
                if existing:
                    continue

                crud.create_alert(
                    db,
                    measurement_id=latest.measurement_id,
                    patient_id=patient.patient_id,
                    alert_type=alert_type,
                    severity="warning",
                    message=message,
                )
                print(f"[ALERT] patient_id={patient.patient_id} type={alert_type}")

    except Exception as e:
        print(f"Error in check_thresholds_job: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = AsyncIOScheduler()
    scheduler.add_job(check_thresholds_job, "interval", minutes=1)
    scheduler.start()
    print("Threshold scheduler started")
    yield
    scheduler.shutdown()
    print("Threshold scheduler stopped")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ALL ROUTERS HERE
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(patients.router, prefix="/patients", tags=["Patients"])
app.include_router(health.router, prefix="/health", tags=["Health"])


init_db()
