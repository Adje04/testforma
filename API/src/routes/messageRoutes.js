import express from 'express';
import { deleteMessage, getCommunityMessages, sendMessage } from '../controllers/Community/MessageController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { chatFile } from '../utils/upload.js';


const router = express.Router();

router.get('/messages/:communityId', verifyToken, getCommunityMessages);

router.post('/send/:communityId', verifyToken, chatFile.single('file'), sendMessage);

router.delete('/message/:messageId', verifyToken, deleteMessage);

export default router;


