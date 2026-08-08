import { io } from 'socket.io-client';

// Une seule instance de socket partagée dans toute l'app, plutôt que d'en ouvrir
// une par composant — évite les connexions dupliquées.
let socket = null;

export function connectSocket() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    if (socket?.connected) return socket;

    // Le token est vérifié côté serveur au handshake (cf. socketConfig.js) —
    // sans lui, la connexion est refusée avant même d'être établie.
    socket = io(import.meta.env.VITE_ASSETS_URL, {
        auth: { token },
        withCredentials: true,
    });

    socket.on('connect_error', (err) => {
        console.error('Erreur de connexion socket:', err.message);
    });

    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export function getSocket() {
    return socket;
}