from fastapi import FastAPI
from routers import users, plants, watering_events
from database import init_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ALL ROUTERS HERE 

init_db()