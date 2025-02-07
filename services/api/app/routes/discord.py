from fastapi import APIRouter, Depends, UploadFile, File
from app.core import db
from sqlmodel import Session
from app.utils.discord_growth import discord_growth
router = APIRouter()

@router.post("/upload_growth_csv/") 
async def upload_growth_csv(client_slug: str, file: UploadFile = File(...), db: Session = Depends(db.get_db)):
    return await discord_growth.upload_csv(db, client_slug, file)
