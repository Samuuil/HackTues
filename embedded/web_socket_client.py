import json
import websocket
import logging
from typing import Callable, Dict, Any


class WebSocketClient:
    def __init__(self, url: str, handlers: Dict[str, Callable]):
        self.ws = websocket.WebSocketApp(url, on_open=self.on_open, on_message=self.on_message, on_close=self.on_close)
        self.handlers = handlers

    def on_open(self, ws, message):
        logging.info("Connected to WebSocket server")

    def on_message(self, ws, message):
        logging.info("Data received: %s", message)
        parsed = json.loads(message)
        logging.info("Received: %s", parsed)
        message_type = parsed.get("type")

        if message_type == "newData":
            self.handlers['onNewData'](parsed)
        elif message_type == "notify":
            self.handlers['onNewNotification'](parsed)
        else:
            logging.error("❌ Unknown message type: %s", message_type)

    def on_close(self, ws, close_status_code, close_msg):
        logging.info("Disconnected")

    def send_message(self, message: Dict[str, Any]):
        self.ws.send(json.dumps(message))

    def start(self):
        self.ws.run_forever()


class Client:
    def __init__(self, handlers: Dict[str, Callable]):
        self.token = ""
        self.ws_client = WebSocketClient("ws://localhost:8080", handlers)
        self.member_id = ""

    async def set_up_client(self, username: str, password: str, room_name: str):
        data = await self.auth_login(username, password)
        self.token = data["token"]

        await self.get_member_info(username, room_name)

    async def auth_login(self, username: str, password: str):
        return {"token": "dummy_token"}

    async def get_member_info(self, username: str, room_name: str):
        pass

    def authenticate(self, member_id: str, room_id: str):
        self.ws_client.send_message({
            "type": "authenticate",
            "payload": {"member_id": member_id, "room_id": room_id}
        })

    def send_notification(self, member_id: str, data: Dict[str, Any], room_id: str):
        logging.info("Sending notification: %s, %s, %s", member_id, data, room_id)
        self.ws_client.send_message({
            "type": "notify",
            "payload": {"member_id": member_id, "room_id": room_id, "data": data}
        })
    def send_new_data(self, member_id: str, data: Dict[str, Any], room_id: str):
        logging.info("Sending notification: %s, %s, %s", member_id, data, room_id)
        self.ws_client.send_message({
            "type": "newData",
            "payload": {"member_id": member_id, "room_id": room_id, "data": data}
        })


