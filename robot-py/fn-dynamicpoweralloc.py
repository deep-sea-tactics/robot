import numpy as np

powerRequestArray = [1, 1, 0.5, 0.5, 0, 0]  # debug
# marqArr current (fuse) minus current for electronics (cameras,pi,arm)
currentLimit = 20


def calcLimit(x):
    # equation derived from https://docs.google.com/spreadsheets/d/1rIfVPKC-plG1GTZuCKPb0hEpbHQJ4Zlnyg2ltgLpQZw/edit?usp=sharing
    return (3.44*10**-3)+(2.64*10**-2)*x+(1.8*10**-3)*x**2+(3.31*10**-5)*x**3+(-1.15*10**-6)*x**4+(1.2*10**-8)*x**5+(-4.23*10**-11)*x**6


def powerRequests(powerRequestArray, debug=False):
    # simplifies equation entry: make sure that incoming values are decimal out of 1
    rqArr = np.array(powerRequestArray)*100
    # polynomial in terms of rqArr: THIS CURVE CALCULATED FOR BLUEROBOTICS T200 out of 100
    requestAdjusted = calcLimit(rqArr)
    fullPowerAdjusted = calcLimit(100)  # when rqArr in requestAdjusted = 100
    powerAmpsOut = np.around(
        (((requestAdjusted)**2)*currentLimit)/(sum(requestAdjusted)*(fullPowerAdjusted)), 6)
    if debug == True:
        print(requestAdjusted)
        print(fullPowerAdjusted)
        print(powerAmpsOut)
        print(sum(powerAmpsOut))
    return (powerAmpsOut)


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
