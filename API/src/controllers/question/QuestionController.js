import Question from '../../models/Question.js';
import User from '../../models/User.js';
import CategoryQuestion from '../../models/CategoryQuestion.js';

export const getQuestionsByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const questions = await Question.find({ user_id: userId })
            .populate('category_question_id', 'name')
            .limit(10);
        if (questions.length) {
            res.status(200).json({
                success: true,
                message: "Toutes vos questions ont été récupérées avec succès",
                data: questions
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Aucune question n'a été trouvée",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Une erreur de source inattendue est survenue',
            error: error.message
        });
    }
};

export const getQuestionsDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const questions = await Question.findOne({ _id: id })
            .populate('responses.user_id', 'name avatar') 
            .lean()
            .exec();

            
        if (!questions) {
            res.status(404).json({
                success: false,
                message: "Aucune question n'a été trouvée",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "question récupérée",
                data: questions
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Une erreur de source inattendue est survenue',
            error: error.message
        });
      
    }

};

export const getAllQuestions = async (req, res) => {
    try {

        const questions = await Question.find({})
            .populate('category_question_id')
            .populate('user_id')
            .lean()
            .sort({ createdAt: -1 })  
            .exec();
         

        // ajouter le nombre de réponses pour chaque questions
        const questionsWithResponseCount = questions.map(question => ({
            ...question,
            responseCount: question.responses.length
        }));
        if (!questions.length) {
            return res.status(404).json({
                success: false,
                message: "questions non trouvées",
            });
        }
        res.status(200).json({
            success: true,
            message: "questions récupérées avec succès",
            data: questionsWithResponseCount,
        });
    } catch (e) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Une erreur de source inattendue est survenue",
        });
    }
};


export const createQuestion = async (req, res) => {
    try {
        const { title, category_question_id, content } = req.body;
        const userId = req.user.id; // Récupère l'ID de l'utilisateur connecté

        // Vérifiez si la catégorie existe
        const categoryExists = await CategoryQuestion.findById(category_question_id);
        if (!categoryExists) {
            return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });
        }

        const question = new Question({ title, category_question_id, content, user_id: userId });
        const savedQuestion = await question.save();
        res.status(201).json({
            success: true,
            message: 'Votre question a bien été enrégistrée',
            data: savedQuestion
        });
    } catch (error) {
        console.log(error)
        // res.status(500).json({
        //     success: false,
        //     message: 'Une erreur de source inattendue s\'est produite',
        //     error: error.message
        // });
    }
};


export const updateQuestion = async (req, res) => {
    const { id } = req.params;

    const { title, category_question_id, content } = req.body;

    const userId = req.user.id;

    try {
        // Vérifie si la question appartient à l'utilisateur
        const question = await Question.findOne({ _id: id, user_id: userId });
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question non trouvée ou accès non autorisé' });
        }

  
        if (category_question_id) {
            const categoryExists = await CategoryQuestion.findById(category_question_id);
            if (!categoryExists) {
                return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });
            }
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            {
                title: title || question.title,
                category_question_id: category_question_id || question.category_question_id,
                content: content || question.content
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            message: "votre question a été modifié avec succès",
            data: updatedQuestion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Une erreur de source inattendue s\'est produite',
            error: error.message
        });
    }
};


export const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 

    try {
        const question = await Question.findOneAndDelete({ _id: id, user_id: userId }); 
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question non trouvée ou accès non autorisé' });
        }
        res.status(200).json({
            success: true,
            message: 'Question supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Une erreur de source inattendue s\'est produite',
            error: error.message
        });
    }
};








