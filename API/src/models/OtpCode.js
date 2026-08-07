import mongoose from "mongoose";

const otpCodeSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: 6,
            maxlength: 128,
        },
        code: {
            type: String, // on stocke le HASH du code, jamais le code en clair
            required: true,
        },
        attempts: {
            type: Number,
            default: 0, // nombre de tentatives échouées, pour bloquer le bruteforce
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    }
);

// Index TTL : MongoDB supprime automatiquement le document une fois expiresAt dépassé
otpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpCode = mongoose.model('OtpCode', otpCodeSchema);