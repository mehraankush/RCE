import mongoose from "mongoose";


const companySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['product', 'service'],
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Company", companySchema);