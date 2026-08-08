import React, { createContext, useState, useContext, useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../socket/socket';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('name');
        const userId = localStorage.getItem('userId');

        if (token) {
            const isAdminRaw = localStorage.getItem('isAdmin');
            setUser({
                token,
                name,
                userId,
                // JSON.parse('null') renvoie null, donc on gère aussi le cas "clé absente"
                isAdmin: isAdminRaw ? JSON.parse(isAdminRaw) : false,
            });
            // reconnecte le socket si on recharge la page en étant déjà connecté
            connectSocket(); // Connecte le socket si l'utilisateur est authentifié
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('isAdmin', JSON.stringify(userData.isAdmin));
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('name', userData.name);
        setUser(userData);
        connectSocket(); // ouvre la connexion socket juste après un login réussi
    };

    const logout = () => {
       
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        setUser(null);
        disconnectSocket(); // ferme la connexion socket a la  déconnexion
    };

    return (
        <UserContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);