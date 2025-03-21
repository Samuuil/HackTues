import asyncio
import logging
from web_socket_client import Client

logging.basicConfig(level=logging.INFO)

async def main():
    handlers = {
        "onNewData": lambda v: None,
        "onNewNotification": lambda v: None
    }

    client_instance = Client(handlers)

    await client_instance.set_up_client("sami", "password", "AAAAAAAA")

    await asyncio.sleep(1)
    client_instance.authenticate("4e0973cf-8bcb-4fb5-bb16-4026b4ba852f", "feda0943-fde0-4020-b5d5-1cdc3a588340")

    async def send_data_interval():
        while True:
            data = {"something": " "}
            client_instance.send_new_data("4e0973cf-8bcb-4fb5-bb16-4026b4ba852f", data, "feda0943-fde0-4020-b5d5-1cdc3a588340")
            await asyncio.sleep(5)  

    async def send_notification_interval():
        while True:
            data = {"something": " "}
            client_instance.send_notification("4e0973cf-8bcb-4fb5-bb16-4026b4ba852f", data, "feda0943-fde0-4020-b5d5-1cdc3a588340")
            await asyncio.sleep(5)

    asyncio.create_task(send_data_interval())
    asyncio.create_task(send_notification_interval())

    client_instance.ws_client.start()

if __name__ == "__main__":
    asyncio.run(main())
