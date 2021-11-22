import { Packet } from './packet'

export class ControllerDataPacket extends Packet {

    id = 1;

    constructor(x: number, y: number) {
        super((() => {
            const byteArr = new Uint8Array(16)
            new DataView(byteArr.buffer).setFloat64(0, x)
            new DataView(byteArr.buffer).setFloat64(8, y)
            return byteArr
        })());
    }

    x(): number {
        return new DataView(this.data.buffer).getFloat64(0)
    }

    y(): number {
        return new DataView(this.data.buffer).getFloat64(8)
    }

}