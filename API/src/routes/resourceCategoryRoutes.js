import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createResourceCategory, deleteResourceCategory, getAllResourceCategory, updateResourceCategory } from '../controllers/categories/ResourceCategoryController.js';
import { verifyUserStatus } from '../middleware/verifyUserStatus.js';

const router = express.Router();

router.get('/resource-category', verifyToken, getAllResourceCategory)

router.post('/create-resource-category', verifyToken, verifyUserStatus, createResourceCategory)

router.delete('/delete-resource-category/:id', verifyToken, verifyUserStatus, deleteResourceCategory)

router.put('/update-resource-category/:id', verifyToken, verifyUserStatus, updateResourceCategory)

export default router;