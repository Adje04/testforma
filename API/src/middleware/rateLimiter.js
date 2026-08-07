import rateLimit from 'express-rate-limit';

// Anti-bruteforce sur le login : 10 tentatives / 15 min / IP
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Trop de tentatives de connexion, réessayez dans 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Anti-bruteforce sur la vérification OTP : 8 tentatives / 15 min / IP
export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Trop de tentatives, réessayez plus tard." },
});

// Anti-spam sur les demandes de reset password / envoi OTP : 5 / heure / IP
export const emailActionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { message: "Trop de demandes, réessayez dans une heure." },
});