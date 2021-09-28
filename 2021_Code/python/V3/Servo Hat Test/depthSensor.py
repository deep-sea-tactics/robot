import ms5837
import time

global millibars
global atmospheres
global tempCentigrade
global tempFarenheit
global depthMeters
global test

sensor = ms5837.MS5837_30BA() # Default I2C bus is 1 (Raspberry Pi 3)
ms5837.DENSITY_FRESHWATER = 997
sensor.setFluidDensity(ms5837.DENSITY_FRESHWATER)

# We must initialize the sensor before reading it
if not sensor.init():
        print("Sensor could not be initialized")
        exit(1)
        
def getMillibars():
        sensor.read()
        millibars = round(sensor.pressure())
        return millibars
def getAtmospheres():
        sensor.read()
        atmospheres = round(sensor.pressure(ms5837.UNITS_atm))
        return atmospheres
def getTempCentigrade():
        sensor.read()
        tempCentigrade = round(sensor.temperature())
        return tempCentigrade
def getTempFarenheit():
        sensor.read()
        tempFarenheit = round(sensor.temperature(ms5837.UNITS_Farenheit))
        return tempFarenheit
def getDepthMeters():
        sensor.read()
        depthMeters = round(sensor.depth())
        return depthMeters

'''        
# Print readings
while True:
        if sensor.read():
                millibars = round(sensor.pressure())
                atmospheres = round(sensor.pressure(ms5837.UNITS_atm))
                tempCentigrade = round(sensor.temperature())
                tempFarenheit = round(sensor.temperature(ms5837.UNITS_Farenheit))
                depthMeters = round(sensor.depth())
                print(millibars, atmospheres, tempCentigrade, tempFarenheit, depthMeters)
                time.sleep(1)
        else:
                print("Sensor read failed!")
                exit(1)
'''



        
