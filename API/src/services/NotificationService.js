import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendCommunityAddedEmail, sendQuestionReplyEmail } from './emailServices.js';

// io est injecté depuis index.js (app.set('io', io)) à chaque appel,
// pour émettre la notification en direct à l'utilisateur concerné s'il est connecté.

async function createAndEmit(io, { recipientId, type, message, link }) {
    const notification = await Notification.create({ recipient: recipientId, type, message, link });

    // Room personnelle : chaque utilisateur connecté rejoint automatiquement
    // `user:<sonId>` au moment de la connexion socket (cf. socketConfig.js).
    io.to(`user:${recipientId}`).emit('notification', notification);

    return notification;
}

export const notifyCommunityAdded = async (io, { recipientId, communityName, communityId }) => {
    const recipient = await User.findById(recipientId);
    if (!recipient) return;

    const link = `/communities/${communityId}`;
    await createAndEmit(io, {
        recipientId,
        type: 'community_added',
        message: `Vous avez été ajouté(e) à la communauté "${communityName}"`,
        link,
    });

    // Évènement "important" -> email en plus du in-app
    await sendCommunityAddedEmail(
        recipient.email,
        recipient.name,
        communityName,
        `${process.env.CLIENT_URL}${link}`
    );
};

export const notifyQuestionReply = async (io, { recipientId, questionTitle, questionId, replierId }) => {
    // Pas de notification si on répond à sa propre question
    if (recipientId.toString() === replierId.toString()) return;

    const recipient = await User.findById(recipientId);
    if (!recipient) return;

    const link = `/question/${questionId}`;
    await createAndEmit(io, {
        recipientId,
        type: 'question_reply',
        message: `Nouvelle réponse à votre question "${questionTitle}"`,
        link,
    });

    await sendQuestionReplyEmail(
        recipient.email,
        recipient.name,
        questionTitle,
        `${process.env.CLIENT_URL}${link}`
    );
};

// Pas d'email ici : un message de chat est trop fréquent pour justifier un email à chaque fois.
// On ne notifie que les membres qui ne sont PAS actuellement en train de regarder ce chat
// (déjà reçu en direct via l'event socket 'newMessage' dans ce cas).
export const notifyNewMessage = async (io, { communityId, communityMembers, senderId, senderName, messageContent }) => {
    const socketsInRoom = await io.in(communityId).fetchSockets();
    const connectedUserIds = new Set(socketsInRoom.map(s => s.user?.id).filter(Boolean));

    const recipients = communityMembers.filter(
        memberId => memberId.toString() !== senderId.toString() && !connectedUserIds.has(memberId.toString())
    );

    const preview = messageContent?.length > 60 ? messageContent.slice(0, 60) + '…' : (messageContent || 'a envoyé un fichier');

    await Promise.all(recipients.map(recipientId =>
        createAndEmit(io, {
            recipientId,
            type: 'new_message',
            message: `${senderName} : ${preview}`,
            link: `/communities/${communityId}`,
        })
    ));
};