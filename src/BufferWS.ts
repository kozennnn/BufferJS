import { Buffer } from 'buffer';
import { DataView } from "./methods/DataView";

export class BufferWS {

    private readonly _dataView: DataView;

    constructor(arraybuffer?: Uint8Array | Buffer) {
        if(arraybuffer == undefined) {
            arraybuffer = new Buffer(5096);
        }
        this._dataView = new DataView(arraybuffer, 0);
    }

    public readByte(): number {
        return this._dataView.nextInt8();
    }

    public readBytes(length: number): BufferWS
    {
        const buffer = new BufferWS(this._dataView.getByteArray().slice(this._dataView.position, this._dataView.position + length));
        this._dataView.position += length;
        return buffer;
    }

    public readBool(): boolean {
        return this.readByte() === 1;
    }

    public readShort(): number {
        return this._dataView.nextInt16();
    }

    public readInt(): number {
        return this._dataView.nextInt32();
    }

    public readDouble(): number {
        return this._dataView.nextFloat64();
    }

    public readString(): string {
        const length = this.readShort();
        const buffer = this.readBytes(length);
        return new TextDecoder('utf-8').decode(buffer.getByteArray());
    }

    public writeByte(byte: number): this {
        this._dataView.pushInt8(byte);
        return this;
    }

    public writeBool(bool: boolean): this {
        if(bool) this.writeByte(1); else this.writeByte(0);
        return this;
    }

    public writeShort(short: number): this {
        this._dataView.pushInt16(short);
        return this;
    }

    public writeInt(int: number): this {
        this._dataView.pushInt32(int);
        return this;
    }

    public writeDouble(double: number): this {
        this._dataView.pushFloat64(double);
        return this;
    }

    public writeString(string: string, includeLength: boolean = true): this {
        const encodedString = new TextEncoder().encode(string);
        if (includeLength) this._dataView.pushInt16(encodedString.length);
        encodedString.forEach((value: number) => {
            this._dataView.pushInt8(value);
        });
        return this;
    }

    public flip(): this {
        this._dataView.flip();
        return this;
    }

    public getByteArray(): Uint8Array {
        return this._dataView.getByteArray();
    }

    public getBuffer(): Buffer {
        return new Buffer(this.getByteArray());
    }
}
