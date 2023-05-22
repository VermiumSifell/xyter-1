export interface IEncryptionData {
  [key: string]: string;
  iv: string;
  content: string;
  authenticationTag: string;
}
