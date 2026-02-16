from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {"message": "Food Preorder Platform API"}

@router.get("/menu-page")
def menu_page():
    return {"message": "Visit /menu for available items"}

@router.get("/preorder-page")
def preorder_page():
    return {"instructions": "POST to /orders/create"}

@router.get("/follow")
def follow():
    return {
        "instagram": "https://instagram.com/yourpage",
        "message": "Follow us for updates!"
    }