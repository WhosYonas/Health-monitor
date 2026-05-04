from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import patients, users

from database import init_db

app = FastAPI()

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

init_db()
