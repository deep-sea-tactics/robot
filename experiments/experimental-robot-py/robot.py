import sioReciever
import os
import time
import json

os.system("sudo pigpiod")
time.sleep(0.5)

sioReciever.start()



