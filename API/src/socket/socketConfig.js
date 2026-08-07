// socketConfig.js
import { Server } from 'socket.io';

// Fonction pour initialiser la configuration de Socket.IO
export  const initializeSocket = (server) => {
  // Création d'une instance de Socket.IO, attachée au serveur HTTP
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Autorise les requêtes depuis le frontend local
      credentials: true,
    },
  });

  // Écoute de la connexion des clients
  io.on('connection', (socket) => {
    console.log(`Client connecté : ${socket.id}`);

    // Gestion de l'inscription de l'utilisateur dans une salle (groupe)
    socket.on('joinCommunity', (communityId) => {
      socket.join(communityId);
      console.log(`Client ${socket.id} a rejoint la communauté : ${communityId}`);
    });

    // Gestion de l'envoi de messages dans la communauté
    socket.on('sendMessage', (data) => {
      const { communityId, message } = data;
      // Émission du message aux membres de la communauté via la salle associée
      io.to(communityId).emit('newMessage', message);
      console.log(`Message envoyé dans la communauté ${communityId} : ${message.content}`);
    });

    // Déconnexion de l'utilisateur
    socket.on('disconnect', () => {
      console.log(`Client déconnecté : ${socket.id}`);
    });
  });

  return io;
};
