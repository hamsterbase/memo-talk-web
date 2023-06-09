import * as CryptoJS from 'crypto-js';

export function generateKeys(
  username: string,
  password: string
): {
  userToken: string;
  encryptionKey: string;
} {
  const memo = 'memo';
  const talk = 'alk';

  const sha256_username = CryptoJS.SHA256(username).toString();
  const sha256_password = CryptoJS.SHA256(password).toString();

  const userToken = CryptoJS.SHA256(
    `${memo}:${sha256_username}:${sha256_password}:${talk}`
  ).toString(CryptoJS.enc.Hex);

  const encryptionKey = CryptoJS.SHA256(`${memo}:${password}:${talk}`).toString(
    CryptoJS.enc.Hex
  );

  return { userToken, encryptionKey };
}

export function encryptData(data: string, key: string): string {
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  return encrypted;
}

export function decryptData(encryptedData: string, key: string): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(
    CryptoJS.enc.Utf8
  );
  return decrypted;
}
