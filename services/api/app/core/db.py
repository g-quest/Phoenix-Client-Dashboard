from sqlmodel import SQLModel, Session, create_engine, select
from app.core.config import settings
from app.models.client import Client

engine = create_engine(str(settings.DATABASE_URL))

def get_db() -> Session:
    with Session(engine) as session:
        yield session


def init_db(session: Session) -> None:
    from app.crud.client import client

    # SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


    # Add optional test data
    # existing_client = session.exec(select(Client).where(Client.slug == "test-client")).first()
    # if not existing_client:
    #     # Add test data
    #     test_client = Client(slug="test-client", name="Test Client", logo_url="http://example.com/logo.png")
    #     session.add(test_client)
    #     session.commit()
    #     print("Test data added.")
    # else:
    #     print("Test data already exists.")