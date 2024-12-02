import jwt from 'jsonwebtoken'
import { Response } from 'express'

const generateTokenAndSetCookie = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  })
  res.cookie('token', token, {
    maxAge: 3 * 24 * 60 * 60 * 1000, // expire in ms
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
  })
}

export default generateTokenAndSetCookie
