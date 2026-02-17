from pydantic import BaseModel
from typing import Dict


class OrderCreate(BaseModel):
    name: str
    phone: str
    department: str
    items: Dict[str, int]


class UTRSubmit(BaseModel):
    token_number: int
    utr_number: str