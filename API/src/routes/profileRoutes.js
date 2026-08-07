import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { deleteAccount, getProfile, updateProfile } from '../controllers/users/profile.js';
import { uploadAvatar } from '../middleware/multerMiddleware.js';


const router = express.Router()

router.put('/profile', uploadAvatar.single('avatar'),  verifyToken, updateProfile);

router.get('/profile', verifyToken, getProfile);

router.delete('/profile', verifyToken, deleteAccount);


export default router