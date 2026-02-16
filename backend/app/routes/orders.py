from fastapi import APIRouter
from app.schemas.order_schema import OrderCreate, UTRSubmit
from app.services.order_service import create_order_service, submit_utr_service
from app.config.settings import settings
from fastapi import UploadFile, File, HTTPException
import cloudinary
import cloudinary.uploader

router = APIRouter()


@router.post("/orders/create")
def create_order(order: OrderCreate):
    token, total_price = create_order_service(order.name, order.phone, order.items)

    upi_link = f"upi://pay?pa={settings.UPI_ID}&pn={settings.UPI_NAME}&am={total_price}&cu=INR"

    return {
        "token_number": token,
        "total_price": total_price,
        "upi_id": settings.UPI_ID,
        "upi_link": upi_link,
        "message": "Pay using UPI and submit UTR number"
    }


@router.post("/orders/submit-utr")
def submit_utr(data: UTRSubmit):
    submit_utr_service(data.token_number, data.utr_number)
    return {"message": "UTR submitted. Awaiting verification."}


# Cloudinary configuration is done at module level
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

@router.post("/orders/upload-screenshot/{token}")
def upload_screenshot(token: int, file: UploadFile = File(...)):
    try:
        # Upload to Cloudinary
        print(f"Starting upload for {file.filename}...")
        result = cloudinary.uploader.upload(file.file, folder="mela_orders", public_id=f"{token}_{file.filename}")
        image_url = result.get("secure_url")
        print(f"Cloudinary URL generated: {image_url}")

        # Update the order with the Cloudinary URL as pseudo-UTR
        submit_utr_service(token, f"Screenshot: {image_url}")
        
        return {"message": "Screenshot uploaded successfully", "url": image_url}
    except Exception as e:
        print(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))