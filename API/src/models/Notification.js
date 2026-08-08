import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['new_message', 'community_added', 'question_reply'],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        // Lien à ouvrir au clic sur la notification côté front (ex: /communities/123, /question/456)
        link: {
            type: String,
            default: null,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Les notifications non lues d'un utilisateur sont la requête la plus fréquente : on l'indexe
notificationSchema.index({ recipient: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;