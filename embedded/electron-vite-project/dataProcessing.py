import RPi.GPIO as GPIO
import time
from gyro_accel import read_raw_data

GPIO.setmode(GPIO.BCM)
GPIO.setup(2, GPIO.OUT)

while True:
    accel_x = read_raw_data(0x3B) / 16384.0

    if accel_x > 1.0:
        GPIO.output(2, GPIO.HIGH)
    else:
        GPIO.output(2, GPIO.LOW)

    time.sleep(0.5)
