import express from 'express';
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionsByUser, getQuestionsDetail, updateQuestion } from '../controllers/question/QuestionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();



router.get('/questions', getAllQuestions); 

router.get('/user-questions', verifyToken, getQuestionsByUser); 

router.get('/question/:id',  getQuestionsDetail); 

router.post('/question-create', verifyToken, createQuestion); 

router.delete('/question-delete/:id', verifyToken, deleteQuestion); 

router.put('/question-update/:id', verifyToken, updateQuestion); 



export default router;





