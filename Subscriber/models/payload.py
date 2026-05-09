from pydantic import BaseModel, Field
from datetime import datetime

class SensorReading(BaseModel):
    device_id: str
    patient_id: int
    heart_rate: int = Field(..., ge=30, le=250)
    spo2: float = Field(..., ge=0.0, le=100.0)
    temperature: float = Field(..., ge=30.0, le=45.0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)