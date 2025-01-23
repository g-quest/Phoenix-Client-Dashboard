from sqlmodel import Session, select
from app.crud.base import CRUDBase
from app.models.csv import CSVData


class CRUDCSV(CRUDBase[CSVData]):

    def get_all_by_client_slug(self, db: Session, slug: str) -> list[CSVData]:
        statement = select(CSVData).where(CSVData.client_slug == slug)
        results = db.execute(statement).scalars().all()
        return results

csv = CRUDCSV(CSVData)
