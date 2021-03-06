// @flow

declare var describe: any;
declare var test: any;
declare var expect: any;

const BigInt = require('big-integer');
const CurvePoint = require('../lib/CurvePoint').default;

describe('Curve', () => {
  describe('Recreate from compressed hex', () => {
    describe('Test cases', () => {
      const compressedPubKey = '020F031CA83F3FB372BD6C2430119E0B947CF059D19CDEA98F4CEFFEF620C584F9';
      const uncompressedPubKey = '040f031ca83f3fb372bd6c2430119e0b947cf059d19cdea98f4ceffef620c584f9f064f1fde4bc07d4f48c5114680ad1adaf5f6eaa2166f7e4b4887703a681b548';
      test(compressedPubKey, () => {
        const point = CurvePoint.fromHex(compressedPubKey);
        expect(point.toHex(false)).toEqual(uncompressedPubKey);
      });
    });
    describe('Random range test', () => {
      for (let key = 252; key < 257; key++) {
        const point = CurvePoint.fromBigInt(new BigInt(key));
        const uncompressedHex = point.toHex(false);
        const compressedHex = point.toHex(true);
        test(`Point (compressed key) ${compressedHex}`, () => {
          const recreatedPoint = CurvePoint.fromHex(compressedHex);
          expect(recreatedPoint.toHex(false)).toEqual(uncompressedHex);
        });
      }
    });
  });
});
