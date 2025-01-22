from fastapi import APIRouter, Body, Depends, HTTPException
from typing import Optional
from app import crud
from app.core import db
from sqlmodel import Session
from app.models.client import Client
from app.utils.client import client

router = APIRouter()

@router.get("/")
def get_clients(*, db: Session = Depends(db.get_db)):
    clients = crud.client.all(db)
    return clients


@router.get("/{slug}")
def get_client(*, db: Session = Depends(db.get_db), slug: str):
    client = crud.client.get_by_slug(db, slug)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.post("/add", response_model=Client)
async def add_client(*, db: Session = Depends(db.get_db), new_client: Client):
    return client.add_client(db, new_client)