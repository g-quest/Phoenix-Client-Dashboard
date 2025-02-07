from sqlmodel import Session, select
from app.crud.base import CRUDBase
from app.models.discord_engagement import DiscordEngagement


class CRUDDiscordEngagement(CRUDBase[DiscordEngagement]):

    def get_all_by_client_slug(self, db: Session, slug: str) -> list[DiscordEngagement]:
        statement = select(DiscordEngagement).where(DiscordEngagement.client_slug == slug)
        results = db.execute(statement).scalars().all()
        return results

discord_engagement = CRUDDiscordEngagement(DiscordEngagement)
