import express from 'express'
import {
    login,
    logout,
    register,
    verifyOtpCode,
    resetPassword,
    verifyEmail,
    forgotPassword,
    refreshAccessToken,

} from '../controllers/AuthController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { uploadAvatar } from '../middleware/multerMiddleware.js';
import { loginLimiter, otpLimiter, emailActionLimiter } from '../middleware/rateLimiter.js';


const router = express.Router()

router.post('/register', uploadAvatar.single('avatar'), register)

router.post('/login', login);

router.post('/refresh-token', refreshAccessToken);

router.post('/verify-otpCode', otpLimiter, verifyOtpCode);

router.post('/logout', logout);

router.post('/verifyEmail', verifyEmail);

router.post('/forgot-password', emailActionLimiter, forgotPassword);

router.post('/resetPassword', resetPassword);


export default router;

