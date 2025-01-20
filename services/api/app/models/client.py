from typing import Optional
from app.models.base import Base
from sqlmodel import Field

class Client(Base, table=True):
    slug: Optional[str] = Field(default=None, unique=True)
    name: Optional[str] = Field(default=None)
    logo_url: Optional[str] = Field(default=None)