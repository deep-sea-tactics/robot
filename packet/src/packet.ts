export abstract class Packet {
    abstract id: number;
    data: Uint8Array;

    constructor(data: Uint8Array) {
        this.data = data
    }

    /** Creates the Uint8Array from this packet */
    generate(): Uint8Array {
        const buildingArray = new Uint8Array(this.data.length + 1)
        buildingArray[0] = this.id
        for (let i = 0; i < this.data.length; i++) {
            buildingArray[i + 1] = this.data[i]
        }
        return buildingArray
    }
}