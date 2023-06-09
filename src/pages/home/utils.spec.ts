import { describe, expect, it, test } from 'vitest';
import { generateKeys, encryptData, decryptData } from './utils';

it('test generateKeys', () => {
  const { userToken, encryptionKey } = generateKeys('user', 'password');

  expect(userToken).toMatchInlineSnapshot(
    '"f52db55d11f5b9004aa17ad0ded2dd8addc0a310a1adfdcf65f4a69403d59b50"'
  );
  expect(encryptionKey).toMatchInlineSnapshot(
    '"97cd998d9c048bc82fb1195c0249d51de4ba022b9b86ed020c8233868bcaea44"'
  );
});

describe('AES Encryption and Decryption', () => {
  test('Encrypt and Decrypt Random Data with Random Key', () => {
    const key = '1234567890abcdef' + Math.random();
    const data = 'Hello, World! This is a test message.' + Math.random();

    const encryptedData = encryptData(data, key);
    const decryptedData = decryptData(encryptedData, key);

    expect(decryptedData).toBe(data);
  });
});
