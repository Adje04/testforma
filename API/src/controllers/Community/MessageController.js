import MessageService from '../../services/Community/MessageService.js';
import { validationResult } from 'express-validator';

export const getCommunityMessages = async (req, res) => {
    const { communityId } = req.params;
     const userId = req.user.id;

    try {
        const messages = await MessageService.getMessagesByCommunity(communityId, userId);
        return res.status(200).json({ success: true, data: messages });
    } catch (err) {
         const status = err.statusCode || 500;
        return res.status(status).json({ success: false, error: err.message });
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

        const data = { sender: senderId, community_id: communityId, content };
        const file = req.file;
        if (file) {
            data.path = file.path;
            data.type = file.mimetype;
            data.size = file.size;
            data.name = file.originalname;
        }

        const io = req.app.get('io');
        const message = await MessageService.createMessage(data, io);

        io.to(communityId).emit('newMessage', message);

        return res.status(201).json({ success: true, data: message, message: 'Message envoyé avec succès' });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        return res.status(status).json({ success: false, error: error.message });
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

  