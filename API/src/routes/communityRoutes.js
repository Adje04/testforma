import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { registerCommunity, addMember, joinCommunity, index, getCommunityByUser } from '../controllers/Community/CommunityController.js';
import { uploadAvatar } from '../middleware/multerMiddleware.js';



const router = express.Router()

router.post('/create-community', verifyToken, uploadAvatar.single('avatar'), registerCommunity)
router.post('/community/:communityId/addmember', verifyToken, addMember)
router.post('/join/:communityId', verifyToken, joinCommunity);
router.get('/communities', index);
router.get('/user-community', verifyToken, getCommunityByUser);

export default router;






