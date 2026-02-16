import json
from app.sheets.sheets_client import read_sheet, update_sheet
from datetime import datetime


def get_all_orders():
    return read_sheet("ORDERS!A2:I")


def mark_paid(token_number: int):
    orders = read_sheet("ORDERS!A2:I")

    for index, row in enumerate(orders):
        if int(row[0]) == token_number:
            sheet_row = index + 2
            update_sheet(f"ORDERS!F{sheet_row}", [["paid"]])
            update_sheet(f"ORDERS!I{sheet_row}", [[datetime.utcnow().isoformat()]])
            break