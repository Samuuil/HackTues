import asyncio
import websockets
import json
import time
from smbus2 import SMBus
from gyro_accel import read_raw_data
from gps import get_gps_data

DEVICE_ADDRESS = 0x68  

ACCEL_XOUT_H = 0x3B
ACCEL_YOUT_H = 0x3D
ACCEL_ZOUT_H = 0x3F

bus = SMBus(1) 

def read_raw_data(register):
    """Reads two bytes of raw data from the given register."""
    high = bus.read_byte_data(DEVICE_ADDRESS, register)
    low = bus.read_byte_data(DEVICE_ADDRESS, register + 1)
    value = (high << 8) | low  

    if value > 32767:  
        value -= 65536
    return value

async def send_data():
    uri = "ws://209.38.192.145:8080"  
    async with websockets.connect(uri) as websocket:
        auth_data = {
            "type": "authenticate",
            "payload" : {
                "member_id":"4e0973cf-8bcb-4fb5-bb16-4026b4ba852f",
                "room_id":"feda0943-fde0-4020-b5d5-1cdc3a588340"
            }
        }
        await websocket.send(json.dumps(auth_data))
        while True:
            accel_x = read_raw_data(ACCEL_XOUT_H) / 16384.0
            accel_y = read_raw_data(ACCEL_YOUT_H) / 16384.0
            accel_z = read_raw_data(ACCEL_ZOUT_H) / 16384.0

            gyro_x = read_raw_data(0x43) / 131.0  
            gyro_y = read_raw_data(0x45) / 131.0
            gyro_z = read_raw_data(0x47) / 131.0

            gps_data = get_gps_data()
            data = {
                "type" : "newData",
                "payload" : {
                    "time" : time.time() * 1000,
                    "data" : {
                        "acce":{
                            "x": round(accel_x, 2),
                            "y": round(accel_y, 2),
                            "z": round(accel_z, 2)
                        },
                        "gyro": {
                            "x": round(gyro_x, 2),
                            "y": round(gyro_y ,2),
                            "z": round(gyro_z, 2)
                        },
                        "gps" : {
                            "lat": 42.665911,
                            "lon": 23.375749
                        }

                    },
                    "member_id":"4e0973cf-8bcb-4fb5-bb16-4026b4ba852f",
                    "room_id":"feda0943-fde0-4020-b5d5-1cdc3a588340"
                }
            }

            await websocket.send(json.dumps(data))
            print(f"Sent: {data}")

            await asyncio.sleep(1)  

asyncio.run(send_data())
