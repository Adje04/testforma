import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Le nom est requis'],
            trim: true,
            maxlength: [64, 'Le nom doit avoir au maximum 64 caractères'],
        },
        email: {
            type: String,
            required: [true, 'L\'email est requis'],
            trim: true,
            unique: [true, 'Cet email est déjà utilisé'],
            minlength: [6, 'L\'email doit avoir au moins 6 caractères'],
            maxlength: [128, 'L\'email doit avoir au maximum 128 caractères'],
        },
        password: {
            type: String,
            required: [true, 'Le mot de passe est requis'],
            minlength: [8, 'Le mot de passe doit avoir au moins 8 caractères'],
        },

        isAdmin: {
            type: Boolean,
            default: false,
        },

        avatar: {
            type: String,
            default: null,
        },

        resetPasswordTokenHash: {
            type: String,
            default: null, // hash du token envoyé par email, jamais le token en clair
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
        },


    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;