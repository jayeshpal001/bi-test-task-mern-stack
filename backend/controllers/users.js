import User from '../models/User.js'

export const updateUser = async (req, res) => {
  const { name, phoneNumber } = req.body
  
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phoneNumber } },
      { new: true, runValidators: true }
    ).select('-password')
    
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).send('Server Error')
  }
}