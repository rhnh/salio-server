import fs from 'fs'
import path from 'path'
import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'
import { IUser } from '../types'
import { isVerifiedPass } from './password'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { findUserById, findUserByUsername } from '../models/user-models'
import { genKeyPair } from '../key-gen'

const PUBLIC_KEY_PATH = path.join(__dirname, '..', 'id_rsa_pub.pem')
const PRIVATE_KEY_PATH = path.join(__dirname, '..', 'id_rsa_priv.pem')
if (!fs.existsSync(PUBLIC_KEY_PATH) || !fs.existsSync(PRIVATE_KEY_PATH)) {
  genKeyPair()
}
const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, 'utf-8')
const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8')

export const authentication = (): void => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user: IUser | null = await findUserByUsername(username)
        if (user && (await isVerifiedPass(password, user?.password))) {
          return user !== null ? done(null, user) : done(null, false)
        }
        return done(null, false)
      } catch (error) {
        return done(error, false)
      }
    })
  )
  //needs to save user._id
  passport.serializeUser(async (user, done) => {
    try {
      return user !== null ? done(null, user) : done(null, false)
    } catch (error) {
      return done(error, false)
    }
  })

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await findUserById(id)

      return user !== null ? done(null, user) : done(null, false)
    } catch (error) {
      return done(error, false)
    }
  })
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUBLIC_KEY,
  algorithms: ['RS256'],
}

export const authorization = (): void => {
  // The JWT payload is passed into the verify callback
  passport.use(
    new JWTStrategy(options, function (jwt_payload, done) {
      // We will assign the `sub` property on the JWT to the database ID of user
      findUserById(jwt_payload.sub)
        .then((user) => {
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch((err) => {
          return done(err, false)
        })
    })
  )
}

export const verifyUser = passport.authenticate('jwt', {
  session: false,
})

export function generateToken(user: IUser): { token: string; expires: string } {
  const _id = user._id
  const expiresIn = '1d'

  const payload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000),
  }

  const signedToken = jsonwebtoken.sign(payload, PRIVATE_KEY, {
    expiresIn: expiresIn,
    algorithm: 'RS256',
  })
  return {
    token: signedToken,
    expires: expiresIn,
  }
}
export function verifyToken(token: string): boolean {
  let result = false
  jsonwebtoken.verify(
    token,
    PUBLIC_KEY,
    { algorithms: ['RS256'] },
    (err, res) => {
      if (err) {
        result = false
      }
      if (res) {
        result = true
      } else {
        result = false
      }
    }
  )

  return result
}
