from app.sheets.sheets_client import read_sheet

def get_menu():
    data = read_sheet("MENU!A2:H")
    menu = []

    for row in data:
        if len(row) < 7:
            continue

        if str(row[6]).strip().lower() == "true":
            item = {
                "id": row[0],
                "name": row[1],
                "category": row[2],
                "description": row[3],
                "price": float(row[4]),
                "image_url": row[5],
                "available": True,
                "category_1": row[7] if len(row) > 7 else "" # Default to empty if column is missing
            }
            menu.append(item)

    return menu


def get_item(item_id: str):
    menu = read_sheet("MENU!A2:G")
    for row in menu:
        if row[0] == item_id:
            return row
    return None
