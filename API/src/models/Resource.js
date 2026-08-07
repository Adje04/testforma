import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        title: { type: String, maxlength: 128, trim: true, required: true },
        cover: { type: String, default: 'coverDefault.png' },
        description: { type: String, maxlength: 512, trim: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: Number, required: true, max: 100 * 1024 * 1024 },
        path: { type: String, required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'ResourceCategory', required: true }

    },
    { timestamps: true }
)

const Resource = mongoose.model('Resource', resourceSchema)

export default Resource;



