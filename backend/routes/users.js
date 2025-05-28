import express from 'express'
import auth from '../middleware/auth.js'
import { updateUser, getCurrentUser } from '../controllers/users.js'
const router = express.Router()

router.get('/me', auth, getCurrentUser)
router.put('/update', auth, updateUser)

export default router