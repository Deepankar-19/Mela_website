from fastapi import APIRouter
from app.services.admin_service import get_all_orders, mark_paid

router = APIRouter()


@router.get("/admin/orders")
def orders():
    return get_all_orders()


@router.post("/admin/mark-paid/{token}")
def mark_order_paid(token: int):
    mark_paid(token)
    return {"message": "Order marked as paid"}