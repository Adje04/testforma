import Message from '../../models/Message.js';



export const getMessagesByCommunity = async (communityId) => {
    try {
        return await Message.find({ community_id: communityId }).populate('sender');
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des messages: ${error.message}`);
    }
};



export const createMessage = async (messageData) => {
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
