import mongoose from "mongoose";


const discussionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        submissionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission",
        },
        type: {
            type: String,
            enum: ['general', 'solution'],
            required: true,
        },
        title: {
            type: String,
            required: function () { return !this.parent; }
        },
        topic: {
            type: String,
            required: function () { return !this.parent; }
        },
        comment: {
            type: String,
            required: true,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Discussion'
        },
        children: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Discussion'
        }],
        votes: {
            type: Number,
            default: 0
        },
        ancestorCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export default mongoose.model("Discussion", discussionSchema);