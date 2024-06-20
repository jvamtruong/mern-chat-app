import User from '../models/user.model.js'

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}