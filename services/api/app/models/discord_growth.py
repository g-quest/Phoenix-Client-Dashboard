from typing import Optional
from app.models.base import Base
from sqlmodel import Field
from datetime import datetime

# Example CSV data associated with a client
class DiscordGrowth(Base, table=True): 
    client_slug: str
    date: str
    discovery_joins: int
    invites: int
    vanity_joins: int
    hubs_joins: int
    bot_joins: int
    integration_joins: int
    other_joins: int
    total_joins: int
    created_at: datetime = Field(default_factory=datetime.utcnow) 
    updated_at: datetime = Field(default_factory=datetime.utcnow)