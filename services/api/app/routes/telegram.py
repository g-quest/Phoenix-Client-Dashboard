from fastapi import APIRouter, Depends
from app.core import db
from sqlmodel import Session
from app.utils.telegram import telegram

router = APIRouter()

@router.post("/add/") 
async def add_telegram_data(client_slug: str, days_back: int = 90, db: Session = Depends(db.get_db)):
    return await telegram.add_telegram_data(db, client_slug, days_back)