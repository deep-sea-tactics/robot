import time
import RoverESC

time.sleep(3)
print "Done sleeping 2 seconds - starting motor test"

#print "Starting motor"
#RoverESC.motor1_go(1600)
#time.sleep(3)
#print "Stopping motor"
#RoverESC.motor1_stop()

print "Starting motor - forward"
RoverESC.motor2_go(1550)
time.sleep(3)

print "Starting motor - backward"
RoverESC.motor2_go(1400)
time.sleep(3)

print "Stopping motor"
RoverESC.motor2_stop()
time.sleep(1)

