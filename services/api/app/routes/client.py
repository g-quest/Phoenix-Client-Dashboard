from fastapi import APIRouter, Depends, HTTPException
from app import crud
from app.core import db
from sqlmodel import Session
from app.models.client import Client
from app.utils.client import client

router = APIRouter()

@router.post("/add", response_model=Client)
async def add_client(*, db: Session = Depends(db.get_db), new_client: Client):
    return client.add_client(db, new_client)

@router.get("/")
def get_all_clients(*, db: Session = Depends(db.get_db)):
    clients = crud.client.all(db)
    return clients

@router.get("/{slug}")
def get_client(*, db: Session = Depends(db.get_db), slug: str):
    client = crud.client.get_by_slug(db, slug)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.get("/{slug}/discord_growth")
def get_discord_growth_data(slug: str, db: Session = Depends(db.get_db)):
    data = crud.discord_growth.get_all_by_client_slug(db, slug)
    return data
