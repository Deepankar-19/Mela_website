from google.oauth2 import service_account
from googleapiclient.discovery import build
from app.config.settings import settings

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

credentials = service_account.Credentials.from_service_account_file(
    settings.GOOGLE_CREDENTIALS_FILE, scopes=SCOPES
)

service = build("sheets", "v4", credentials=credentials)

SPREADSHEET_ID = settings.GOOGLE_SHEET_ID


def read_sheet(range_name: str):
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name
    ).execute()
    return result.get("values", [])


def append_sheet(range_name: str, values: list):
    body = {"values": values}
    service.spreadsheets().values().append(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name,
        valueInputOption="RAW",
        body=body
    ).execute()


def update_sheet(range_name: str, values: list):
    body = {"values": values}
    service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name,
        valueInputOption="RAW",
        body=body
    ).execute()