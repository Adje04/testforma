import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        content: { type: String},

        community_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },

        name: { type: String, default: '' },

        type: { type: String, default: null},

        size: { type: Number, max: 100 * 1024 * 1024 },

        path: { type: String, default:null },

    },
    { timestamps: true }
)

const Message = mongoose.model('message', messageSchema);

export default Message;

