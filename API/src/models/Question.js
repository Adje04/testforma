import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        category_question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CategoryQuestion',
            required: true
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        responses: [{ 
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String,
                required: true,
                trim: true

            }
        }]
    },
    { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema)

export default Question;