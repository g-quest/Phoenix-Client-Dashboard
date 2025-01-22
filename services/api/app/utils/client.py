from fastapi import HTTPException
from app import crud
from sqlmodel import Session
from app.models.client import Client
from slugify import slugify

class Client:

    def add_client(self, db: Session, client: Client):

        slug = slugify(client.name)
        if client.name:
            existing_client = crud.client.get_by_slug(db, slug)
            if existing_client:
                raise HTTPException(status_code=400, detail="A client with this name already exists. Please use a different name.")
        
        # Create new client
        try:
            client.slug = slug
            return crud.client.add(db, client)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


client = Client()