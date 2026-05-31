import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/UserModel.js'

export const loginAuthentication = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: ["Email and password are required"] })
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() })
    if (!user || !user.isActive) {
      return res.status(401).json({ message: ["Invalid email or password"] })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(401).json({ message: ["Invalid email or password"] })
    }

    const secretKey = process.env.JWT_SECRET || 'fallback_super_secret_key'
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      secretKey, 
      { expiresIn: '1d' }
    )

    res.cookie('token', token, {
      httpOnly: true,                 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
      maxAge:60 * 60 * 1000     
    })

    const loggedInUser = user.toObject()
    delete loggedInUser.password
    delete loggedInUser.isActive

  
    return res.status(200).json({
      message: "Login successful!",
      payload: loggedInUser
    })

  } catch (error) {
    console.error("Login Service Error:", error)
    return res.status(500).json({ message: ["Internal server error during login"] })
  }
}


export const logoutUserSession = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  })
  return res.status(200).json({ message: "Logged out successfully!" })
}
