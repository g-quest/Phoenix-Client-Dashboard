from fastapi import APIRouter, Body, Depends, HTTPException
from typing import Optional
from app import crud
from app.core import db
from sqlmodel import Session
from app.models.client import Client

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
async def add_client(*, db: Session = Depends(db.get_db), client: Client):
    # Check if slug is unique
    if client.slug:
        existing_client = crud.client.get_by_slug(db, client.slug)
        if existing_client:
            raise HTTPException(status_code=400, detail="Client with this slug already exists")
    
    # Create new client
    new_client = Client(**client.dict())
    try:
        return crud.client.add(db, new_client)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")