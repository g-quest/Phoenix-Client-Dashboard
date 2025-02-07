from fastapi import HTTPException, UploadFile, File
from sqlmodel import Session
from app.models.discord_growth import DiscordGrowth
import os
import pandas as pd
import tempfile


class DiscordGrowth:

    async def upload_csv(self, db: Session, client_slug: str, file: UploadFile = File(...)):

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

            # Insert data into the database
            for _, row in df.iterrows():
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


discord_growth = DiscordGrowth()