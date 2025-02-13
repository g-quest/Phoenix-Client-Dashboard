from fastapi import HTTPException
from sqlmodel import Session
from app.models.telegram_data import TelegramData
import httpx
from datetime import datetime, timedelta
import os


class Telegram:

    async def add_telegram_data(self, db: Session, client_slug: str, days_back: int = 90):

        if client_slug == "humanity-protocol":
            chat_id = "-1002115021495"
            COMBOT_API_KEY = os.getenv("COMBOT_HUMANITY_API_KEY")
        elif client_slug == "io-net":
            chat_id = "-1002130009599"
            COMBOT_API_KEY = os.getenv("COMBOT_IO_NET_API_KEY")
        else:
            days_back = 90

        try:
            api_key = COMBOT_API_KEY
            if not api_key:
                raise HTTPException(status_code=500, detail="API key not found in environment variables.")

            # Calculate the 'from' and 'to' dates
            to_date = datetime.utcnow()
            from_date = to_date - timedelta(days=days_back)

            # print(f"Fetching data from {from_date} to {to_date}")

            # Convert dates to timestamps
            to_timestamp = int(to_date.timestamp())
            from_timestamp = int(from_date.timestamp())

            # print(f"Fetching data from {from_timestamp} to {to_timestamp}")

            # Fetch data from the API
            url = f"https://api.combot.org/v2/a/g/?chat_id=-1002115021495&from={from_timestamp}&to={to_timestamp}&api_key={api_key}"
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()

            # print(data)

            # Fetch existing dates from the database
            existing_dates = set(
                date for (date,) in db.query(TelegramData.date)
                .filter(TelegramData.client_slug == client_slug)
                .all()
            )

            # Process the data
            for entry in data:
                messages_dict = {timestamp: count for timestamp, count in entry["messages"]}
                new_users_dict = {timestamp: count for timestamp, count in entry["new_users"]}
                left_users_dict = {timestamp: count for timestamp, count in entry["left_users"]}
                active_users_dict = {timestamp: count for timestamp, count in entry["active_users"]}

                for timestamp in messages_dict:
                    date = datetime.utcfromtimestamp(timestamp / 1000).replace(hour=0, minute=0, second=0, microsecond=0).strftime('%Y-%m-%dT%H:%M:%S+00:00')
                    
                    if date not in existing_dates:

                        telegram_data = TelegramData(
                            client_slug=client_slug,
                            date=date,
                            messages=messages_dict[timestamp],
                            new_users=new_users_dict[timestamp],
                            left_users=left_users_dict[timestamp],
                            active_users=active_users_dict[timestamp],
                        )
                        db.add(telegram_data)
            db.commit()

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error fetching data: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")

        return {"detail": "Telegram data added successfully!"}

telegram = Telegram()