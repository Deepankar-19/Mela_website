from fastapi import APIRouter
from app.services.menu_service import get_menu

router = APIRouter()

@router.get("/menu")
def menu():
    return get_menu()