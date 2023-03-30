import numpy as np

# all used data sets are derived from:
# https://docs.google.com/spreadsheets/d/1rIfVPKC-plG1GTZuCKPb0hEpbHQJ4Zlnyg2ltgLpQZw/edit?usp=sharing

powerRequestArray = [1, 1, 0.5, 0.5, 0, 0]  # debug
# marqArr current (fuse) minus current for electronics (cameras,pi,arm)
currentLimit = 20

# defines the polynomial (derived from dataset above) that converts a percentage of power to an amps current. This allows us to use an arbitrary input range (0-1) and convert it to a current value,
# to be used in the powerRequests function.
def percentageToCurrent(x):
	return 3.44E-03 + 2.64*x + 18*x**2 + 33.1*x**3 + -115*x**4 + 120*x**5 + -42.3*x**6


def powerRequests(powerRequestArray, debug=False):
    # simplifies equation entry: make sure that incoming values are decimal out of 1
    rqArr = np.array(powerRequestArray)

    requestAdjusted = percentageToCurrent(rqArr)
    fullPowerAdjusted = percentageToCurrent(1)

    powerAmpsOut = np.around(
        ((requestAdjusted**2) * currentLimit) / (sum(requestAdjusted) * fullPowerAdjusted),
		6
	)

    if debug == True:
        print(requestAdjusted)
        print(fullPowerAdjusted)
        print(powerAmpsOut)
        print(sum(powerAmpsOut))
    return (powerAmpsOut)


# Converts an amps current array to a PWM array. This is a polynomial fit of the data from the spreadsheet mentioned above.
def ampsToPWMEQ(amps, orders):
    for (amps, orders) in zip(amps, orders):
        if orders < 0:
            return (1449) + (-100)*(amps) + (29.1) * (amps**2) + (-5.27)*(amps**3) + (0.504)*(amps**4) + (-0.0238)*(amps**5) + (4.38*10**-4)*(amps**6)
        elif orders == 0:
            return 0
        else:
            return (1552) + (96.9)*(amps) + (-27.8)*(amps**2) + (5.02)*(amps**3) + (-0.481)*(amps**4) + (0.0228)*(amps**5) + (-4.2*10**-4)*(amps**6)


ampsToPWMEQ([15, 0, 15], [1, 0, -1])
powerRequests(powerRequestArray, True)  # temp,debug
