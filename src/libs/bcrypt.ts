import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export default class PasswordEncoder {
  public static encode(plainTextPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plainTextPassword, SALT_ROUNDS, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  public static compare(
    plainTextPassword: string,
    hash: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainTextPassword, hash, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
