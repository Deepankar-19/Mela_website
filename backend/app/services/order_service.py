import json
from datetime import datetime
from app.sheets.sheets_client import read_sheet, append_sheet, update_sheet
from app.services.menu_service import get_item


def generate_token():
    counter = read_sheet("COUNTER!A2:B2")
    current = int(counter[0][1])
    new = current + 1
    update_sheet("COUNTER!B2", [[new]])
    return new


def create_order_service(name, phone, items):
    total_price = 0
    item_details = []

    for item_id, qty in items.items():
        row = get_item(item_id)
        price = float(row[4])
        subtotal = price * qty
        total_price += subtotal

        item_details.append({
            "id": item_id,
            "qty": qty,
            "price": price,
            "subtotal": subtotal
        })

    token = generate_token()

    append_sheet("ORDERS!A2", [[
        token,
        name,
        phone,
        "",  # Department (Column D)
        json.dumps(item_details),
        total_price,
        "awaiting_payment",
        "",
        datetime.utcnow().isoformat(),
        ""
    ]])

    return token, total_price


def submit_utr_service(token_number, utr_number):
    orders = read_sheet("ORDERS!A2:J")

    for index, row in enumerate(orders):
        if int(row[0]) == token_number:
            sheet_row = index + 2

            update_sheet(f"ORDERS!H{sheet_row}", [[utr_number]])
            update_sheet(f"ORDERS!G{sheet_row}", [["verification_pending"]])
            break