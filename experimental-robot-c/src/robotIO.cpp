#include <iostream>
#include <vector>
#include "pigpio.h"
#include <sys/inotify.h>

/* data format in
	thrusterPins: Array<number>;
	thrusterPWM: Array<number>;
	servoPins: Array<number>;
	servoPositions: Array<number>;
	inputPins: Array<number>;
*/

std::vector<int> thrusterpins;
std::vector<int> servopins;
std::vector<float> thrusterpwm;

int pwmdutycycle(int pwm) {
	return pwm/2500*1000000;
}

int pinSetInputs(std::vector<int> thrusterpins, std::vector<int> servopins) {
	gpioInitialise();
	for (int i = 0; i < thrusterpins.size(); ++i)
	{
		gpioSetMode(thrusterpins[i], PI_OUTPUT);
		gpioHardwarePWM(thrusterpins[i], 400, pwmdutycycle(1500));
	}
	for (int i = 0; i < servopins.size(); ++i)
	{
		gpioSetMode(servopins[i], PI_OUTPUT);
	}
}

int thrusterPWMScan(std::vector<int> thrusterpins,std::vector<float> thrusterpwm) {
	for (int i = 0; i < thrusterpins.size(); ++i)
	{
		gpioHardwarePWM(thrusterpins[i], 400, pwmdutycycle(thrusterpwm[i]));
	}
}

int changeDetector() {
	
}

int main() {
	pinSetInputs(thrusterpins, servopins);
	thrusterPWMScan(thrusterpins, thrusterpwm);
}


	