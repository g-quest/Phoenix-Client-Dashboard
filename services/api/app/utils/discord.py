from fastapi import HTTPException, UploadFile, File
from sqlmodel import Session
from app.models.discord_growth import DiscordGrowth
from app.models.discord_engagement import DiscordEngagement
import os
import pandas as pd
import tempfile


class Discord:

    async def upload_growth_csv(self, db: Session, client_slug: str, file: UploadFile = File(...)):

        # Validate file type
        if not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")

        # Use a temporary file to store uploaded content
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp_file:
                temp_file_name = temp_file.name
                temp_file.write(await file.read())

            # Read and validate the CSV
            df = pd.read_csv(temp_file_name)
            required_columns = [
                "day_pt", "discovery_joins", "invites", "vanity_joins",
                "hubs_joins", "bot_joins", "integration_joins", "other_joins", "total_joins"
            ]
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid CSV format. Missing required columns: {', '.join(missing_columns)}"
                )

            # Get existing dates for the client_slug
            existing_dates = set(
                date for (date,) in db.query(DiscordGrowth.date)
                .filter(DiscordGrowth.client_slug == client_slug)
                .all()
            )

            # Insert new data into the database
            for _, row in df.iterrows():
                if row["day_pt"] not in existing_dates:
                    discord_growth_data = DiscordGrowth(
                        client_slug=client_slug,
                        date=row["day_pt"],
                        discovery_joins=row["discovery_joins"],
                        invites=row["invites"],
                        vanity_joins=row["vanity_joins"],
                        hubs_joins=row["hubs_joins"],
                        bot_joins=row["bot_joins"],
                        integration_joins=row["integration_joins"],
                        other_joins=row["other_joins"],
                        total_joins=row["total_joins"],
                    )
                    db.add(discord_growth_data)
            db.commit()

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_name):
                os.remove(temp_file_name)

        return {"detail": "CSV uploaded and processed successfully!"}

    async def upload_engagement_csv(self, db: Session, client_slug: str, file: UploadFile = File(...), csv_type: str = "engagement"):

        # Validate file type
        if not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")

        # Use a temporary file to store uploaded content
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp_file:
                temp_file_name = temp_file.name
                temp_file.write(await file.read())

            # Read and validate the CSV
            df = pd.read_csv(temp_file_name)

            if csv_type == "engagement":
                required_columns = [
                    "interval_start_timestamp", "visitors", "pct_communicated"
                ]
            elif csv_type == "messages":
                required_columns = [
                    "interval_start_timestamp", "messages", "messages_per_communicator"
                ]
            else:
                raise HTTPException(status_code=400, detail="Invalid CSV type specified.")

            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid CSV format. Missing required columns: {', '.join(missing_columns)}"
                )

            # Get existing records for the client_slug
            existing_records = {
                record.date: record for record in db.query(DiscordEngagement)
                .filter(DiscordEngagement.client_slug == client_slug)
                .all()
            }

            # Insert or update data in the database
            for _, row in df.iterrows():
                existing_record = existing_records.get(row["interval_start_timestamp"])
                if csv_type == "engagement":
                    if existing_record:
                        # Update existing record
                        existing_record.visitors = row["visitors"]
                        existing_record.pct_communicated = row["pct_communicated"]
                    else:
                        # Add new record
                        discord_engagement_data = DiscordEngagement(
                            client_slug=client_slug,
                            date=row["interval_start_timestamp"],
                            visitors=row["visitors"],
                            pct_communicated=row["pct_communicated"],
                        )
                        db.add(discord_engagement_data)
                elif csv_type == "messages":
                    if existing_record:
                        # Update existing record
                        existing_record.messages = row["messages"]
                        existing_record.messages_per_communicator = row["messages_per_communicator"]
                    else:
                        # Add new record
                        discord_message_data = DiscordEngagement(
                            client_slug=client_slug,
                            date=row["interval_start_timestamp"],
                            messages=row["messages"],
                            messages_per_communicator=row["messages_per_communicator"],
                        )
                        db.add(discord_message_data)
            db.commit()

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_name):
                os.remove(temp_file_name)

        return {"detail": "CSV uploaded and processed successfully!"}


discord = Discord()