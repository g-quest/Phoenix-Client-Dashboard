from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel, func
from sqlalchemy.orm import declared_attr
from sqlalchemy import Column, DateTime


class Base(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True, unique=True, index=True)

    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime, nullable=False, default=func.now())
    )
    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())
    )

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__[0].lower() + "".join(
            "_" + letter.lower() if letter.isupper() else letter
            for letter in cls.__name__[1:]
        )
