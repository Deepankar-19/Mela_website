from pydantic import BaseModel


class MenuItem(BaseModel):
    id: str
    name: str
    category: str
    description: str
    price: float
    image_url: str
    available: bool