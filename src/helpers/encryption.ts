import crypto from "crypto";
import { IEncryptionData } from "../interfaces/EncryptionData";

const generateRandomIV = (): Buffer => {
  return crypto.randomBytes(16);
};

const encrypt = (
  text: crypto.BinaryLike,
  encryptionSecret: crypto.BinaryLike
): IEncryptionData => {
  const iv = generateRandomIV();
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionSecret, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  const hmac = crypto.createHmac("sha256", encryptionSecret);
  hmac.update(encrypted);
  const authenticationTag = hmac.digest("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
    authenticationTag,
  };
};

const decrypt = (
  hash: IEncryptionData,
  encryptionSecret: crypto.BinaryLike
): string => {
  const ivBuffer = Buffer.from(hash.iv, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    encryptionSecret,
    ivBuffer
  );

  const contentBuffer = Buffer.from(hash.content, "hex");
  const decrypted = Buffer.concat([
    decipher.update(contentBuffer),
    decipher.final(),
  ]);

  const hmac = crypto.createHmac("sha256", encryptionSecret);
  hmac.update(contentBuffer);
  const expectedAuthenticationTag = hmac.digest("hex");

  if (hash.authenticationTag !== expectedAuthenticationTag) {
    throw new Error(
      "Authentication failed. The encrypted data may have been tampered with."
    );
  }

  return decrypted.toString();
};

export default {
  encrypt,
  decrypt,
};
