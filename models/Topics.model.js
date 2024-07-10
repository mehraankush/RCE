import mongoose from "mongoose";

const topicsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        link: {
            type: String,
        },

    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Topics", topicsSchema);
