import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/generateToken'
import { Request, Response } from 'express'

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    res.json(user)
  } catch (error) {
    console.error('error in getCurrentUser controller', error)
    res.status(500).json({ message: error.message })
  }
}

export const signup = async (
  req: Request<{}, {}, { fullName: string; username: string; password: string; gender: string }>,
  res: Response
) => {
  try {
    const { fullName, username, password, gender } = req.body
    const user = await User.findOne({ username })
    if (user) {
      res.status(400).json({ message: 'user already exists' })
      return
    }

    // hash password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
    })

    if (newUser) {
      generateTokenAndSetCookie(newUser._id.toString(), res)
      await newUser.save()
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      })
    } else res.status(400).json({ message: 'invalid user data' })
  } catch (error) {
    console.error('error in signup controller:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const login = async (req: Request<{}, {}, { username: string; password: string }>, res: Response) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    )
    if (!user || !isPasswordCorrect) {
      console.error('invalid username or password')
      res.status(400).json({ message: 'invalid username or password' })
      return
    }
    generateTokenAndSetCookie(user._id.toString(), res)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.error('error in login controller:', error)
    res.status(500).json({ message: error.message })
  }
}

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie('token')
    res.status(200).json({ message: 'logged out successfully' })
  } catch (error) {
    console.error('error in logout controller:', error)
    res.status(500).json({ message: error.message })
  }
}
