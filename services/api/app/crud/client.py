from sqlmodel import Session, select
from app.crud.base import CRUDBase
from app.models.client import Client


class CRUDClient(CRUDBase[Client]):

    def get_by_slug(self, db: Session, slug: str) -> Client:
        statement = select(Client).where(Client.slug == slug)
        result = db.execute(statement).first()
        return result[0] if result else None

client = CRUDClient(Client)
