import bcrypt from "bcrypt";
import User from "../models/User.js";
import { OtpCode } from "../models/OtpCode.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { sendOtpEmail, sendResetPasswordEmail } from "../services/emailServices.js";
import { generateOpaqueToken, hashToken, generateAccessToken } from "../utils/tokens.js";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config()

// Durée de vie du refresh token (session "longue")
const REFRESH_TOKEN_DAYS = 30;

// Options du cookie contenant le refresh token
// httpOnly : inaccessible en JS (protège du vol par XSS)
// secure : uniquement envoyé en HTTPS (à activer en prod, cf. .env)
// sameSite: 'lax' : protection CSRF de base
const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    path: '/api/v1.0.0/refresh-token',
};

// Mêmes attributs que le cookie posé, MAIS sans maxAge : depuis Express 5,
// clearCookie ignore/déprécie maxAge (il expire déjà immédiatement par défaut).
const clearRefreshCookieOptions = {
    httpOnly: refreshCookieOptions.httpOnly,
    secure: refreshCookieOptions.secure,
    sameSite: refreshCookieOptions.sameSite,
    path: refreshCookieOptions.path,
};

async function issueRefreshToken(userId) {
    const { rawToken, hash } = generateOpaqueToken();
    await RefreshToken.create({
        userId,
        tokenHash: hash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000),
    });
    return rawToken;
}



export const register = async (req, res) => {

    const { name, email, password, passwordConfirm } = req.body;
    const avatar = req.file ? req.file.path : null;


    if (!password) {
        return res.status(400).json({ message: 'Le mot de passe est requis' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Le mot de passe doit avoir au moins 8 caractères' });
    }
    if (password !== passwordConfirm) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }


    const uniqueEmail = await User.findOne({ email });
    if (uniqueEmail) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    try {
        const user = new User({ name, email, password: passwordHash, avatar });
        await user.save();

        const otpCode = String(Math.floor(100000 + Math.random() * 900000));
        // await OtpCode.create({ email, code: otpCode });
        const otpHash = await bcrypt.hash(otpCode, 10);

        await OtpCode.findOneAndUpdate(
            { email },
            {
                code: otpHash,
                attempts: 0,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // valide 10 minutes
            },
            { upsert: true }
        );

        await sendOtpEmail(email, otpCode);

        res.status(201)
            .json({
                success: true,
                message: "inscription réussie",
            });
    } catch (err) {

        res.status(500)
            .json({
                success: false,
                message: "Une erreur inattendue s'est produite",
                error: process.env.NODE_ENV === 'production' ? undefined : err.message,
            });

    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    // const secret = process.env.JWT_SECRET
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secret, {
        //     expiresIn: '1y',
        // });

        const accessToken = generateAccessToken(user);
        const refreshToken = await issueRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        res.status(200).json({
            success: true,
            data: user,
            message: 'Connexion réussie.',
            accessToken, // le front garde celui-ci en mémoire (pas en localStorage, cf. étape front)
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// renouvelle un access token à partir du refresh token (cookie httpOnly)
export const refreshAccessToken = async (req, res) => {
    const rawToken = req.cookies?.refreshToken;

    if (!rawToken) {
        return res.status(401).json({ message: 'Session expirée, veuillez vous reconnecter.' });
    }

    try {
        const tokenHash = hashToken(rawToken);
        const stored = await RefreshToken.findOne({ tokenHash });

        if (!stored || stored.expiresAt < new Date()) {
            res.clearCookie('refreshToken', clearRefreshCookieOptions);
            return res.status(401).json({ message: 'Session expirée, veuillez vous reconnecter.' });
        }

        const user = await User.findById(stored.userId);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur introuvable.' });
        }

        // Rotation : on supprime l'ancien refresh token et on en émet un nouveau
        await stored.deleteOne();
        const newRefreshToken = await issueRefreshToken(user._id);
        res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

        const accessToken = generateAccessToken(user);
        res.status(200).json({ success: true, accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


export async function logout(req, res) {
    try {
        const rawToken = req.cookies?.refreshToken;
        if (rawToken) {
            const tokenHash = hashToken(rawToken);
            await RefreshToken.deleteOne({ tokenHash });
        }
        res.clearCookie('refreshToken', clearRefreshCookieOptions);
        
        res.status(200).json({ success: true, message: 'Utilisateur déconnecté.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};


export const verifyOtpCode = async (req, res) => {
    const { email, code, purpose } = req.body;

    try {
        const otp = await OtpCode.findOne({ email });

        if (!otp) {
            return res.status(400).json({ message: 'Code invalide ou expiré' });
        }

        // if (code !== otp.code) {
        //     return res.status(400).json({ message: 'Code OTP invalide.' });
        // }

        // Anti-bruteforce : blocage après 5 tentatives échouées
        if (otp.attempts >= 5) {
            await otp.deleteOne();
            return res.status(429).json({ message: 'Trop de tentatives. Redemandez un code.' });
        }

        const isValid = await bcrypt.compare(String(code), otp.code);

        if (!isValid) {
            otp.attempts += 1;
            await otp.save();
            return res.status(400).json({ message: 'Code OTP invalide.' });
        }

        await otp.deleteOne();

        const user = await User.findOne({ email });
             if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        if (purpose === 'reset-password') {
            // L'OTP prouve la possession de la boîte mail : on émet un token de reset
            // à usage unique, pour que /resetPassword ne repose plus sur un simple id devinable.
            const { rawToken, hash } = generateOpaqueToken();
            user.resetPasswordTokenHash = hash;
            user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'OTP vérifié avec succès.',
                resetToken: rawToken,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'OTP vérifié avec succès.',
            redirectUrl: user.isAdmin ? '/dashboard' : '/userDashboard',
        });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
}

// Renvoie un nouveau code OTP quand l'ancien a expiré ou n'a jamais été reçu.
// Réutilisé par la page d'inscription (code-confirmation) ET la page de
// mot de passe oublié (email-confirmation) : le comportement est identique,
// seul le "purpose" affiché au frontend change.
export const resendOtpCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email requis." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        const otpCode = String(Math.floor(100000 + Math.random() * 900000));
        const otpHash = await bcrypt.hash(otpCode, 10);

        await OtpCode.findOneAndUpdate(
            { email },
            {
                code: otpHash,
                attempts: 0,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // valide 10 minutes, on repart à zéro
            },
            { upsert: true }
        );

        await sendOtpEmail(email, otpCode);

        res.status(200).json({
            success: true,
            message: "Un nouveau code vous a été envoyé par email.",
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


export const verifyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email, });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const otpCode = String(Math.floor(100000 + Math.random() * 900000));
        // await OtpCode.create({ email, code: otpCode });
        const otpHash = await bcrypt.hash(otpCode, 10);

        await OtpCode.findOneAndUpdate(
            { email },
            { code: otpHash, attempts: 0, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
            { upsert: true }
        );

        await sendOtpEmail(email, otpCode);

        res.status(200).json({ success: true, data: user, message: "Un code de confirmation a été envoyé à votre adresse email." });
    } catch (err) {

        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};


//demande de reset password (génère un token, l'envoie par email)
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        // Réponse identique que l'utilisateur existe ou non : évite l'énumération d'emails
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "Si ce compte existe, un email de réinitialisation a été envoyé.",
            });
        }

        const { rawToken, hash } = generateOpaqueToken();
        user.resetPasswordTokenHash = hash;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // valide 1 heure
        await user.save();

        // Le lien envoyé par email contient le token EN CLAIR (jamais stocké tel quel en DB)
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${rawToken}?email=${encodeURIComponent(email)}`;
        sendResetPasswordEmail(email, resetLink);

        res.status(200).json({
            success: true,
            message: "Si ce compte existe, un email de réinitialisation a été envoyé.",
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Nécessite maintenant le token reçu par email
export const resetPassword = async (req, res) => {
    const { email, token, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
        return res.status(400).json({
            success: false,
            message: "Les mots de passe ne correspondent pas.",
        });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Le mot de passe doit avoir au moins 8 caractères' });
    }

    try {
        const tokenHash = hashToken(token);

        const user = await User.findOne({
            email,
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpires: { $gt: new Date() }, // token pas expiré
        });

        if (!user) {
            return res.status(400).json({ message: "Lien de réinitialisation invalide ou expiré." });
        }

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordTokenHash = null;
        user.resetPasswordExpires = null;
        await user.save();

        // Bonus sécurité : on révoque toutes les sessions actives de cet utilisateur
        await RefreshToken.deleteMany({ userId: user._id });

        res.status(200).json({
            success: true,
            message: "Mot de passe réinitialisé avec succès.",
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};