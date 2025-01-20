from typing import Type, TypeVar, Generic, List, Optional, Dict, Any
from sqlmodel import Session, select
from sqlmodel.sql.expression import Select, SelectOfScalar

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class CRUDBase(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def add(self, db: Session, obj_in: ModelType) -> ModelType:
        try:
            db.add(obj_in)
            db.commit()
            db.refresh(obj_in)
            return obj_in
        except Exception as e:
            db.rollback()
            raise e

    def get(self, db: Session, id: int) -> Optional[ModelType]:
        try:
            return db.get(self.model, id)
        except Exception as e:
            raise e

    def get_by(self, db: Session, params: Dict[str, Any]) -> Optional[ModelType]:
        try:
            statement = select(self.model)
            for k, v in params.items():
                statement = statement.where(getattr(self.model, k) == v)
            return db.exec(statement).first()
        except Exception as e:
            raise e

    def all(
        self,
        db: Session,
        params: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
        offset: int = 0,
        limit: int = 100,
    ) -> List[ModelType]:
        try:
            statement: SelectOfScalar[ModelType] = select(self.model).offset(offset).limit(limit)
            if params:
                for k, v in params.items():
                    statement = statement.where(getattr(self.model, k) == v)
            if sort:
                sort_keys = sort.split(",")
                for sort_key in sort_keys:
                    if sort_key.startswith("-"):
                        statement = statement.order_by(getattr(self.model, sort_key[1:]).desc())
                    else:
                        statement = statement.order_by(getattr(self.model, sort_key).asc())
            return db.exec(statement).all()
        except Exception as e:
            raise e

    def delete(self, db: Session, id: int) -> Optional[ModelType]:
        try:
            obj = db.get(self.model, id)
            if obj:
                db.delete(obj)
                db.commit()
                return obj
            else:
                return None
        except Exception as e:
            db.rollback()
            raise e
