import jwt from 'jsonwebtoken'
import fs from 'fs'

export default class JwtUtil {
  private static algorithName: jwt.Algorithm = 'HS256'

  private static privateKey = fs.readFileSync(
    process.env.JWT_PEM_PATH ?? '',
    'utf8'
  )

  public static create(payload: { user_id: string }) {
    try {
      const exp = process.env.JWT_EXPIRES_IN || '1h'
      const signOptions: jwt.SignOptions = {
        algorithm: JwtUtil.algorithName,
        expiresIn: exp,
      }
      const token = jwt.sign(payload, JwtUtil.privateKey, signOptions)
      return token
    } catch (err) {
      console.log('JwtUtil.verify() ERR::', err)
      return null
    }
  }

  public static verify(token: string): Promise<{ user_id: string }> {
    return new Promise((resolve, reject) => {
      // const verifyOptions = { algorithm: JwtUtil.algorithName };
      const verifyOptions = { algorithms: [JwtUtil.algorithName] }
      jwt.verify(token, JwtUtil.privateKey, verifyOptions, (err, payload) => {
        if (err) {
          console.log('JwtUtil.verify() ERR::', err)
          reject(err)
        } else {
          resolve(payload as unknown as { user_id: string })
        }
      })
    })
  }
}
