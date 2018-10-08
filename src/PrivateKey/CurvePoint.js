/**
 * Point on Eliptic Curve
 */
// @flow
import BigInt from 'big-integer';
import * as stringfu from 'stringfu';
import { field, basePoint, prime } from './secp256k1';

export default class CurvePoint {
  _x: BigInt
  _y: BigInt

  constructor(x: BigInt, y: BigInt) {
    this._x = x;
    this._y = y;
  }

  get x() { return this._x; }
  get y() { return this._y; }

  add() {
    const lamda = basePoint.y
      .subtract(this.y)
      .multiply(
        basePoint.x.subtract(this.x).modInv(field)
      )
      .mod(field);
    const x = lamda
      .pow(2)
      .subtract(this.x)
      .subtract(basePoint.x)
      .mod(field);
    let y = lamda
      .multiply(this.x.subtract(x))
      .subtract(this.y)
      .mod(field);
    if (y.isNegative()) {
      y = y.add(field);
    }

    // Update x/y
    this._x = x;
    this._y = y;
  }

  double() {
    const lamda = this.x
      .pow(2)
      .multiply(3)
      .multiply(
        this.y.multiply(2).modInv(field)
      ).mod(field);
    const x = lamda
      .pow(2)
      .subtract(this.x.multiply(2))
      .mod(field);
    let y = lamda
      .multiply(this.x.subtract(x))
      .subtract(this.y)
      .mod(field);
    
    if (y.isNegative()) {
      y = y.add(field);
    }
    
    // Update x/y
    this._x = x;
    this._y = y;
  }

  multiply(key: BigInt) {
    if (key.isZero() || key.greaterOrEquals(prime)) {
      throw new Error('Invalid key');
    }

    const keyBits = key.toString(2).split('');
    for (let i = 1; i <  keyBits.length; i++) {
      this.double();
      if (keyBits[i] === '1') {
        this.add();
      }
    }
  }

  toBytes(compressed: boolean = true) {
    const length = compressed ? 33 : 65;
    let bytes = new Uint8Array(length);
    if (!compressed) {
      // Uncompressed === 0x04<x><y>
      bytes.set([0x04], 0);
      bytes.set(this.x.toArray(256).value, 1);
      bytes.set(this.y.toArray(256).value, 33);
    } else {
      // Compressed === 0x02||0x03<x>
      if (this.y.isEven()) {
        bytes.set([0x02], 0);
      } else {
        bytes.set([0x03], 0);
      }
      bytes.set(this.x.toArray(256).value, 1);
    }
    return bytes;
  }

  toHex(compressed: boolean = true) {
    const bytes = this.toBytes(compressed);
    return stringfu.fromBytes(bytes);
  }
}
