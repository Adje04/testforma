import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true, trim: true, maxlength: 64
        },
        description: {
            type: String, default: null, trim: true
        },
        avatar: {
            type: String, default: null, trim: true
        },

        engineeringfield: {
            type: String,
            required: true,
            enum: [],
            trim: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
        },

        members: [
            {
                user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                joinedAt: { type: Date, default: Date.now }
            }
        ],
        invitations: [{

            email: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }]

    },
    { timestamps: true }
);

const Community = mongoose.model('Community', communitySchema);

export default Community;