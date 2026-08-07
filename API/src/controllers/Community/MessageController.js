import MessageService from '../../services/Community/MessageService.js';
import { validationResult } from 'express-validator';
export const getCommunityMessages = async (req, res) => {
    const { communityId } = req.params;

    try {
        const messages = await MessageService.getMessagesByCommunity(communityId);
        return res.status(200).json({ success: true, data: messages });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

export const sendMessage = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { content } = req.body;
        const senderId = req.user.id;
        const { communityId } = req.params;

        const data = {
            sender: senderId,
            community_id: communityId,
            content: content,
        };
       const file = req.file
        // Ajouter les informations du fichier si un fichier est envoyé
        if (file) {
            data.path = file.path;
            data.type = file.mimetype;
            data.size = file.size;
            data.name = file.originalname;
        }

        const message = await MessageService.createMessage(data);

        const io = req.app.get('io');
       io.to(communityId).emit('newMessage', message);

        return res.status(201).json({
            success: true,
            data: message,
            message: 'Message envoyé avec succès',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};



export const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user.id; 

    try {
        const result = await MessageService.deleteMessage(messageId, userId);
        if (result.success) {
            return res.status(200).json({ success: true, message: 'Message supprimé avec succès' });
        } else {
            return res.status(403).json({ success: false, message: result.message });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

  