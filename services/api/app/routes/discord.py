from fastapi import APIRouter, Depends, UploadFile, File
from app.core import db
from sqlmodel import Session
from app.utils.discord import discord
router = APIRouter()

@router.post("/upload/growth_csv/") 
async def upload_growth_csv(client_slug: str, file: UploadFile = File(...), db: Session = Depends(db.get_db)):
    return await discord.upload_growth_csv(db, client_slug, file)

@router.post("/upload/engagement_csv/")
async def upload_engagement_csv(client_slug: str, file: UploadFile = File(...), db: Session = Depends(db.get_db), csv_type: str = "engagement"):  
    return await discord.upload_engagement_csv(db, client_slug, file, csv_type)

