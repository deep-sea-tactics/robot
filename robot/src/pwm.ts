import i2c from "i2c-bus"
import { logger } from "./logger"

const servoAddress = 0x40

// Recursive function that tries its best to connect again and again
export function startOrElse() {
	try {
		start(servoAddress)
	} catch (exception) {
		logger.warn("Error: ${exception}. Attempting again")
		startOrElse() // recall the function
	}
}

/**
 * Wrapper for the PromisifiedBus object, for reading/writing to a specific address.
 */
class BusWrapper {

	/** The address of the device. */
	address: number

	/** The internal object used to read & write to the device */
	device: i2c.PromisifiedBus

	constructor(address: number, device: i2c.PromisifiedBus) {
		this.address = address;
		this.device = device;
	}

	async write(length: number, buffer: Buffer): Promise<i2c.BytesWritten> {
		return await this.device.i2cWrite(this.address, length, buffer)
	}

	async read(length: number, buffer: Buffer): Promise<i2c.BytesRead> {
		return await this.device.i2cRead(this.address, length, buffer)
	}

}

class BusFactory {

	device: i2c.PromisifiedBus

	constructor(device: i2c.PromisifiedBus) {
		this.device = device
	}

	bus(address: number): BusWrapper {
		return new BusWrapper(address, this.device)
	}

	/** Convenience method to use a BusWrapper in a function */
	useBus(address: number, func: (wrapper: BusWrapper) => Promise<void>): void {
		func(this.bus(address))
	}

	async close(): Promise<void> {
		return await this.device.close()
	}
}

async function start(address: number): Promise<void> {

	// We use 1 as the address is (usually) at /dev/i2c-1
	const i2cDevice = await i2c.openPromisified(1)

	// Use a factory. Allows us to easily get a device w/ its address in its own scope
	const i2cFactory = new BusFactory(i2cDevice)

	i2cFactory.useBus(address, async wrapper => {
		// Sample write of writing to an i2c device
		wrapper.write(5, Buffer.from("aaa"))
	})

}