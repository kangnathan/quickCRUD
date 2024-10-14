import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JSWTOKEN

class JWTService {
    static sign(tokenInfo) {
        return jwt.sign(tokenInfo, jwtSecret, { expiresIn: '1h' }) // Adjust expiration as needed
    }

    static verify(token) {
        try {
            return jwt.verify(token, jwtSecret)
        } catch (error) {
            throw new Error('Invalid token')
        }
    }
}

export default JWTService
