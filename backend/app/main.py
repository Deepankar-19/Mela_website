from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import menu, orders, admin, pages

app = FastAPI(title="Food Preorder Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(pages.router)

# from fastapi.staticfiles import StaticFiles
# import os

# if not os.path.exists("uploads"):
#     os.makedirs("uploads")

# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")