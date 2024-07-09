import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
    {
        problem: {
            type: mongoose.Types.ObjectId,
            ref: 'Problem',
            required: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        attempts: [
            {
                type: String
            }
        ],
        solution: {
            language: {
                type: mongoose.Types.ObjectId,
                ref: "ProgrammingLanguage",
                required: true,
            },
            code: {
                type: String,
                required: true,
            },
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Submission', submissionSchema);
