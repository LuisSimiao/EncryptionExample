const { encrypt, decrypt } = require('../AES_Example');

describe('AES_Example', () => {
  test('encrypt-decrypt roundtrip preserves plaintext', () => {
    const plain = JSON.stringify({ device_id: 'device_1', event: 'test' });
    const enc = encrypt(plain);
    const dec = decrypt(enc);
    expect(dec).toBe(plain);
  });

  test('decrypt throws or returns original for invalid input', () => {
    expect(() => decrypt('not-a-valid-format')).toThrow();
  });
});