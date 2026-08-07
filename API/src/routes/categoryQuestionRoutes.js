import express from 'express'
import { createCategoryQuestion, deleteCategoryQuestion, getAllCategoryQuestion, updateCategoryQuestion } from '../controllers/categories/CategoryQuestionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyUserStatus } from '../middleware/verifyUserStatus.js';

const router = express.Router()

router.get('/category-question', verifyToken, getAllCategoryQuestion)

router.post('/category-create', verifyToken, verifyUserStatus, createCategoryQuestion)

router.put('/category-update/:id', verifyToken, verifyUserStatus, updateCategoryQuestion)

router.delete('/category-delete/:id', verifyToken, verifyUserStatus, deleteCategoryQuestion)

export default router;


