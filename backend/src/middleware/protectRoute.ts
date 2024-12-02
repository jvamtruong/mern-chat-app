import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

declare module 'express-serve-static-core' {
  interface Request {
    userId: string
  }
}

const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token
    if (!token) {
      res.status(401).json({ message: 'unauthorized - no token provided' })
      return
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      res.status(401).json({ message: 'unauthorized - invalid token' })
      return
    }
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.error('error in protectRoute middleware', error)
    res.status(500).json({ message: error.message })
  }
}

export default protectRoute
