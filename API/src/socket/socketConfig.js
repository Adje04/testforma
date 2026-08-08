import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Community from '../models/Community.js';

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
            credentials: true,
        },
    });

    // le token JWT (le même access token que pour les requêtes REST) est
    // vérifié au moment du handshake, avant même d'accepter la connexion.
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentification requise'));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            socket.user = decoded; // { id, isAdmin }
            next();
        } catch (err) {
            next(new Error('Token invalide ou expiré'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connecté : ${socket.id} (user ${socket.user.id})`);

        // Room personnelle : permet d'envoyer une notification ciblée à CET utilisateur
        // précis, peu importe où il navigue dans l'appli, sans connaître son socket.id.
        socket.join(`user:${socket.user.id}`);

        socket.on('joinCommunity', async (communityId) => {
            try {
                // Vérifie que l'utilisateur est bien membre de la communauté avant de le laisser rejoindre la room
                const community = await Community.findById(communityId);
                if (!community) return;

                const isMember = community.members.some(m => m.user_id.toString() === socket.user.id)
                    || community.user_id.toString() === socket.user.id;

                if (!isMember) {
                    socket.emit('errorMessage', "Vous n'êtes pas membre de cette communauté");
                    return;
                }

                socket.join(communityId);
                console.log(`User ${socket.user.id} a rejoint la communauté : ${communityId}`);
            } catch (err) {
                console.error('Erreur joinCommunity socket:', err);
            }
        });

        socket.on('leaveCommunity', (communityId) => {
            socket.leave(communityId);
        });

        // L'envoi de message passe par la route REST POST /send/:communityId,
        // qui valide, persiste en DB, puis émet elle-même 'newMessage' via req.app.get('io').
        socket.on('disconnect', () => {
            console.log(`Client déconnecté : ${socket.id}`);
        });
    });

    return io;
};