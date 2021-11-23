declare module 'adafruit-i2c-pwm-driver-async' {

    export interface PwmDriverOptions {
        address?: number,
        device?: string,
        debug?: boolean,
        i2cDebug?: boolean,
        isMockDriver?: boolean
    }

    export class PwmDriver {
        constructor(options: PwmDriverOptions)

        async init(): Promise<number[]>
        async setPWM(channel: number, on: number, off: number): Promise<number[]>
        async setPWMFreq(freq: number): Promise<number[]>
    }

    export function sleep(seconds: number)
    export function usleep(micros: number)
}