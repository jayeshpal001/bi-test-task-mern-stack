import jwt from 'jsonwebtoken';
import User from '../models/User.js';

 const auth = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Authentication required');
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user and attach to request
   const user = await User.findById(decoded.id).select('-password'); 


    if (!user) {
      throw new Error('User not found');
    }

    // 4. Attach user and token to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || 'Not authorized to access this resource'
    });
  }
};
export default auth; 