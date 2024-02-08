import { promisify } from 'util'
import pkg from 'jsonwebtoken'


const { sign, verify } = pkg


const SECRET = 'secret'


const signJWT = promisify(sign)


export const createToken = async ({ email }) => {
  const result = await signJWT({ email }, SECRET)

  return result
}


export const verifyPass = (required) => {
  const func = async (req, res, next) => {
    try {
      const token = req.header('Authorization').split(' ')[1]

      const getPayload = async () => {
        return new Promise((resolve, reject) => {
          verify(token, SECRET, (err, decoded) => {
            err && !decoded
              ? reject()
              : resolve(decoded)
          })
        })
      }

      const payload = await getPayload()

      if (payload) {
        req.email = payload.email
      } else if (required) throw new Error()

      next()
    } catch {
      return required
        ? res.status(401).json({ err: 'Client authorization is required' })
        : next()
    }
  }

  return func
}