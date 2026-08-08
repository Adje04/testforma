import Message from '../../models/Message.js';
import Community from '../../models/Community.js';

// Vérifie que userId fait bien partie des membres (ou est le créateur) de la communauté
async function assertIsMember(communityId, userId) {
    const community = await Community.findById(communityId);
    if (!community) {
        const err = new Error('Communauté non trouvée');
        err.statusCode = 404;
        throw err;
    }

    const isCreator = community.user_id.toString() === userId;
    const isMember = community.members.some(m => m.user_id.toString() === userId);

    if (!isCreator && !isMember) {
        const err = new Error('Vous n\'êtes pas membre de cette communauté');
        err.statusCode = 403;
        throw err;
    }
}

export const getMessagesByCommunity = async (communityId, userId) => {
    await assertIsMember(communityId, userId);
    try {
        return await Message.find({ community_id: communityId }).populate('sender');
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des messages: ${error.message}`);
    }
};

export const createMessage = async (messageData) => {
    await assertIsMember(messageData.community_id, messageData.sender);
    try {
        const message = await Message.create(messageData);
        return message;
    } catch (error) {
        throw new Error(`Erreur lors de l'envoi du message: ${error.message}`);
    }
};

export const deleteMessage = async (messageId, userId) => {
    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return { success: false, message: 'Message non trouvé' };
        }
        if (message.sender.toString() !== userId) {
            return { success: false, message: 'Vous ne pouvez supprimer que vos propres messages' };
        }

        await Message.findByIdAndDelete(messageId);
        return { success: true };
    } catch (error) {
        throw new Error(`Erreur lors de la suppression du message: ${error.message}`);
    }
};

const MessageService = {
    createMessage,
    deleteMessage,
    getMessagesByCommunity,
};

export default MessageService;
