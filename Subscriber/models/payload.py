from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class SensorReading(BaseModel):
    #ge and le can be adjusted, greater/less/equal than
    heart_rate: int = Field(..., ge=30, le=250)
    spo2: float = Field(..., ge=0.0, le=100.0)
    temp: float = Field(..., ge=20.0, le=45.0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    #Validates value
    @field_validator("heart_rate", "spo2", "temp")
    @classmethod #Pydantic semantics for validation
    def no_nullish(cls, v): #Checks for non-zero values
        if v is None:
            raise ValueError("Sensor field cannot be None")
        return v