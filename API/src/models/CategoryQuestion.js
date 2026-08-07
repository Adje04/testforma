import mongoose from "mongoose";

const categoryQuestionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            maxlength: 128,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: null,
            trim: true
        }
    },
    { timestamps: true }
)

const CategoryQuestion = mongoose.model('CategoryQuestion', categoryQuestionSchema)

export default CategoryQuestion;






