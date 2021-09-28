import sys
import time
time.sleep(1) # As i said it is too impatient and so if this delay is removed you will get an error
import RPi.GPIO as io
io.setmode(io.BCM)
io.setup(10,io.IN) #makes pin into an put to read in data from sensor

#leak = io.input(10)  # 0 is dry and 1 is wet/pin 19 or 10th on the left side

def leakCheck():	
	while True:
		leak = io.input(10)
		if leak == 0:
			#print("No Leak Detected")
			leakNum = 111
		else:
			#print("BREACH IN SYSTEM!")
			leakNum = 222
		return leakNum
		#time.sleep(5)

''' just a test
while True:
	num = leakCheck()
	print(num)
	time.sleep(5)
'''
