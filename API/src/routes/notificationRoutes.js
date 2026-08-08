import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/NotificationController.js';

const router = express.Router();

router.get('/notifications', verifyToken, getNotifications);

router.put('/notifications/:id/read', verifyToken, markAsRead);

router.put('/notifications/read-all', verifyToken, markAllAsRead);

export default router;