import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/generateToken.js'

export const getCurrentUser = (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    console.error('error in getCurrentUser controller', error)
    res.status(500).json({ message: error.message })
  }
}

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, gender } = req.body
    const user = await User.findOne({ username })
    if (user) {
      return res.status(400).json({ message: 'user already exists' })
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
      generateTokenAndSetCookie(newUser._id, res)
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

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    )
    if (!user || !isPasswordCorrect) {
      console.error('invalid username or password')
      return res.status(400).json({ message: 'invalid username or password' })
    }
    generateTokenAndSetCookie(user._id, res)
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

export const logout = (req, res) => {
  try {
    res.clearCookie('token')
    res.status(200).json({ message: 'logged out successfully' })
  } catch (error) {
    console.error('error in logout controller:', error)
    res.status(500).json({ message: error.message })
  }
}
