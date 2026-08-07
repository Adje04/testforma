import mongoose from "mongoose";

const resourceCategorySchema = new mongoose.Schema(
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
        },
       
    },
    { timestamps: true }
)

const ResourceCategory = mongoose.model('ResourceCategory', resourceCategorySchema)

export default ResourceCategory;