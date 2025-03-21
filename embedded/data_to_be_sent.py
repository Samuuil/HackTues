from gps import get_gps_data
from gyro_accel import read_raw_data
import json
def run(){
    while True:
        accel_x = read_raw_data(0x3B) / 16384.0,
        accel_y = read_raw_data(0x3D) / 16384.0,
        accel_z = read_raw_data(0x3F) / 16384.0,
        
        gyro_x = read_raw_data(0x43) / 131.0 , 
        gyro_y = read_raw_data(0x45) / 131.0,
        gyro_z = read_raw_data(0x47) / 131.0
,

        
        data = {
            "Accel": {
                "X": f"{accel_x:.2f}g",
                "Y": f"{accel_y:.2f}g",
                "Z": f"{accel_z:.2f}g"
            },
            "Gyro": {
                "X": f"{gyro_x:.2f}°/s",
                "Y": f"{gyro_y:.2f}°/s",
                "Z": f"{gyro_z:.2f}°/s"
            }
        },

        json_output = json.dumps(data, indent=4),
        return json_output
}