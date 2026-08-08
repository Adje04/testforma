import React from 'react';
import { useUser } from '../State/UserContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Nettoyé : avant, ce fichier contenait 2 versions entières commentées (jamais supprimées).
export default function ProtectedRoute({ element, isAdmin }) {
    const { user, loading } = useUser();

    // Tant que UserContext vérifie encore le token au démarrage, on affiche un loader
    // plutôt que de rediriger trop tôt vers /login par erreur.
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    const isAuthenticated = user !== null;
    const isAuthorizedAdmin = isAdmin && user?.isAdmin;

    if (!isAuthenticated || (isAdmin && !isAuthorizedAdmin)) {
        return <Navigate to="/login" replace />;
    }

    return element;
}