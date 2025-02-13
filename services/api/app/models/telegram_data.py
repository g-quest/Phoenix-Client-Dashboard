from typing import Optional
from app.models.base import Base
from sqlmodel import Field, UniqueConstraint
from datetime import datetime

# Example CSV data associated with a client
class TelegramData(Base, table=True): 
    client_slug: str
    date: str
    messages: Optional[int] = None
    new_users: Optional[int] = None
    left_users: Optional[int] = None
    active_users: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow) 
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    __table_args__ = (UniqueConstraint('client_slug', 'date', name='uix_telegram_data_client_date'),)