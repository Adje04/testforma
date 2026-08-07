import Question from '../../../models/Question.js';
import User from '../../../models/User.js';




export const getResponses = async (req, res) => {
    const { questionId } = req.params;

    try {
        // Vérifiez si la question existe
        const question = await Question.findById(questionId).populate('responses.user_id', 'name');
        if (!question) {

            return res.status(404).json({ success: false, message: 'Aucune question trouvé' });

        } else if (!question.responses.length) {

            return res.status(200).json({ success: true, message: 'Aucune réponse disponible pour cette question' });

        } else {

            return res.status(200).json({ success: true, data: question.responses });

        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Une erreur inattendue est survenue, veuillez réessayer plus tard.',
            error: error.message || 'Erreur serveur'
        });
    }
};


export const addResponse = async (req, res) => {
    const { questionId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        // Vérifiez si la question existe
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question non trouvée' });
        }

        // Vérifiez que le contenu de la réponse n'est pas vide
        if (!content || content.trim() === '') {
            return res.status(400).json({ success: false, message: 'Le contenu de la réponse ne peut pas être vide' });
        }

        // Ajout de la réponse à la question
        question.responses.push({ user_id: userId, content });
        const questionResponse = await question.save();

        res.status(201).json({
            success: true,
            message: 'votre réponse a été enrégistrée avec succès.',
            data: questionResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Une erreur inattendue est survenue, veuillez réessayer plus tard.',
            error: error.message || 'Erreur serveur'
        });
    }
};

export const updateResponse = async (req, res) => {
    const { questionId, responseId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        // Vérifiez si la question existe
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question non trouvée' });
        }

        // Vérifiez que la réponse à mettre à jour existe et appartient à l'utilisateur
        const response = question.responses.id(responseId);
        if (!response) {
            return res.status(404).json({ success: false, message: 'Réponse non trouvée' });
        }

        if (response.user_id.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Accès non autorisé' });
        }

        // Vérifiez que le nouveau contenu de la réponse n'est pas vide
        if (!content || content.trim() === '') {
            return res.status(400).json({ success: false, message: 'Le contenu de la réponse ne peut pas être vide' });
        }

        // Mettez à jour la réponse
        response.content = content;
        const questionResponse = await question.save();

        res.status(200).json({
            success: true,
            message: "votre réponse a ben été mis à jour",
            data: questionResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Une erreur inattendue est survenue, veuillez réessayer plus tard.',
            error: error.message || 'Erreur serveur'
        });
    }
};


export const deleteResponse = async (req, res) => {
    const { questionId, responseId } = req.params;
    const userId = req.user.id;

    try {
        // Vérifiez si la question existe
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question non trouvée' });
        }

        // Vérifiez que la réponse à supprimer existe et appartient à l'utilisateur
        const response = question.responses.id(responseId);
        if (!response || response.user_id.toString() !== userId) {
            return res.status(404).json({ success: false, message: 'Réponse non trouvée ou accès non autorisé' });
        }

        // Supprimez la réponse
        response.deleteOne();
        const newResponse = await question.save();

        res.status(200).json({
            success: true,
            message: 'Réponse supprimée avec succès',
            data: newResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Une erreur inattendue est survenue, veuillez réessayer plus tard.',
            error: error.message || 'Erreur serveur'
        });
    }
};



