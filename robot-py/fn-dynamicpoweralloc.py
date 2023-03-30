import numpy as np 
powerRequestArray = [1,1,0.5,0.5,0,0] #debug
currentLimit=20  # max current (fuse) minus current for electronics (cameras,pi,arm)
def powerRequests(powerRequestArray,debug=False):
	rqArr = list(np.array(powerRequestArray)*100) # simplifies equation entry: make sure that incoming values are decimal out of 1
	x = np.array(rqArr) # simplifies equuation entry
	requestAdjusted = list((3.44*10**-3)+(2.64*10**-2)*x+(1.8*10**-3)*x**2+(3.31*10**-5)*x**3+(-1.15*10**-6)*x**4+(1.2*10**-8)*x**5+(-4.23*10**-11)*x**6) # polynomial in terms of x: THIS CURVE CALCULATED FOR BLUEROBOTICS T200 out of 100
	fullPowerAdjusted = ((3.44*10**-3)+(2.64*10**-2)*100+(1.8*10**-3)*100**2+(3.31*10**-5)*100**3+(-1.15*10**-6)*100**4+(1.2*10**-8)*100**5+(-4.23*10**-11)*100**6) # when x in requestAdjusted = 100 
	powerAmpsOut = np.around((((np.array(requestAdjusted))**2)*currentLimit)/(sum(requestAdjusted)*(fullPowerAdjusted)),6)
	return(powerAmpsOut)
	if debug == True:	
		print(requestAdjusted)
		print(fullPowerAdjusted)
		print(powerAmpsOut)
		print(sum(powerAmpsOut))

powerRequests(powerRequestArray,True) #temp,debug
