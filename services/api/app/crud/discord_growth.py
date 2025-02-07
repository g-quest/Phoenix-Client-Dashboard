from sqlmodel import Session, select
from app.crud.base import CRUDBase
from app.models.discord_growth import DiscordGrowth


class CRUDDiscordGrowth(CRUDBase[DiscordGrowth]):

    def get_all_by_client_slug(self, db: Session, slug: str) -> list[DiscordGrowth]:
        statement = select(DiscordGrowth).where(DiscordGrowth.client_slug == slug)
        results = db.execute(statement).scalars().all()
        return results

discord_growth = CRUDDiscordGrowth(DiscordGrowth)
