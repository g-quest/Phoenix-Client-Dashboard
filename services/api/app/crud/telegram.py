from sqlmodel import Session, select
from app.crud.base import CRUDBase
from app.models.telegram_data import TelegramData  


class CRUDTelegram(CRUDBase[TelegramData]):

    def get_all_by_client_slug(self, db: Session, slug: str) -> list[TelegramData]:
        statement = select(TelegramData).where(TelegramData.client_slug == slug)
        results = db.execute(statement).scalars().all()
        return results

telegram = CRUDTelegram(TelegramData)
