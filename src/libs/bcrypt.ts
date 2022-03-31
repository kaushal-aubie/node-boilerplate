import bcrypt from 'bcrypt';

/** Optimal and Fast, Suggested by author of bcrypt */
const SALT_ROUNDS = 8;

export default class Bcrypt {
  /**
   * Encodes The Plain Text Password
   * @param {string} plainText
   * @returns string
   */
  public static encode(plainText: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plainText, SALT_ROUNDS, (err, hash) => {
        if (err) {
          console.error('JwtUtil.encode() ERR::', err);
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  /**
   * Compares the PlainText with Encrypted Password
   * @param {string} plainText
   * @param {string} hash
   * @returns boolean
   */
  public static compare(plainText: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainText, hash, (err, result) => {
        if (err) {
          console.error('Bcrypt.compare() ERR::', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
