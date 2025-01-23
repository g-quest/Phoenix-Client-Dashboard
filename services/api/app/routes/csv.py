from fastapi import APIRouter, Depends, UploadFile, File
from app.core import db
from sqlmodel import Session
from app.utils.csv import csv
router = APIRouter()

@router.post("/upload_csv/")
async def upload_csv(client_slug: str, file: UploadFile = File(...), db: Session = Depends(db.get_db)):
    return await csv.upload_csv(db, client_slug, file)
