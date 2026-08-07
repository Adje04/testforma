import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Génère un token aléatoire opaque (pour refresh token et reset password)
// On renvoie le token brut (à donner au client/email) ET son hash (à stocker en DB)
export function generateOpaqueToken() {
    const rawToken = crypto.randomBytes(40).toString('hex');
    const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
    return { rawToken, hash };
}

// Permet de retrouver le hash à partir d'un token reçu du client, pour comparer avec la DB
export function hashToken(rawToken) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
}

// Access token JWT — courte durée de vie, c'est LUI qui autorise les requêtes API
export function generateAccessToken(user) {
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' } // avant : 1 an. 15 minutes = fenêtre d'exploitation minime si volé
    );
}