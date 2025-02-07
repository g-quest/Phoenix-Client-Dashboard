from typing import Optional
from app.models.base import Base
from sqlmodel import Field, UniqueConstraint
from datetime import datetime

# Example CSV data associated with a client
class DiscordEngagement(Base, table=True): 
    client_slug: str
    date: str
    visitors: Optional[int] = None
    pct_communicated: Optional[float] = None
    messages: Optional[int] = None
    messages_per_communicator: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow) 
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    __table_args__ = (UniqueConstraint('client_slug', 'date', name='uix_discord_engagement_client_date'),)