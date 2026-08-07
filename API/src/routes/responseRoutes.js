import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { addResponse, deleteResponse, getResponses, updateResponse } from '../controllers/question/response/responseController.js';


const router = express.Router();

router.get('/:questionId/responses', getResponses)

router.post('/:questionId/add-response', verifyToken, addResponse);

router.delete('/:questionId/delete-response/:responseId', verifyToken, deleteResponse);

router.put('/:questionId/update-response/:responseId', verifyToken, updateResponse);

export default router;