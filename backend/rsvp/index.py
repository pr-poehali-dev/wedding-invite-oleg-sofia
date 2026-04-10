import json
import os
import urllib.request
import urllib.parse

CHAT_ID = "926397614"

def handler(event: dict, context) -> dict:
    """Принимает RSVP-ответ гостя и отправляет его в Telegram."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "Не указано")
    attending = body.get("attending")
    drinks = body.get("drinks", [])
    custom_drink = body.get("customDrink", "")

    if attending == "yes":
        attending_text = "✅ Будет"
    elif attending == "no":
        attending_text = "❌ Не сможет"
    else:
        attending_text = "Не указано"

    drinks_list = drinks if drinks else []
    if custom_drink:
        drinks_list.append(f"Свой вариант: {custom_drink}")
    drinks_text = ", ".join(drinks_list) if drinks_list else "—"

    message = (
        f"🥂 <b>Новый ответ на приглашение</b>\n\n"
        f"👤 <b>Гость:</b> {name}\n"
        f"📋 <b>Придёт:</b> {attending_text}\n"
        f"🍷 <b>Напитки:</b> {drinks_text}"
    )

    token = os.environ["TELEGRAM_BOT_TOKEN"]
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
    }).encode()

    req = urllib.request.Request(url, data=data, method="POST")
    urllib.request.urlopen(req)

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": True}),
    }
