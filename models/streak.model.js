// models/streak.model.js
import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastSolveDate: {
        type: Date,
        default: null
    }
});

export default mongoose.model('Streak', streakSchema);