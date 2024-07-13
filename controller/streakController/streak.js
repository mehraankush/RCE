import { catchHandler, errorHandler } from '../../utils/ErrorHandler.js';
import StreakModel from '../../models/streak.model.js';
import { successHandler } from '../../utils/sucessHandler.js'

export const updateStreak = async (userId) => {
    try {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streak = await StreakModel.findOne({ userId });
        if (!streak) {
            streak = new StreakModel({ userId });
        }

        if (streak.lastSolveDate && streak.lastSolveDate.getTime() === today.getTime()) {
            return streak;
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (streak.lastSolveDate && streak.lastSolveDate.getTime() === yesterday.getTime()) {
            streak.currentStreak += 1;
        } else {
            streak.currentStreak = 1;
        }

        streak.lastSolveDate = today;

        if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
        }

        await streak.save();
        return streak;
    } catch (error) {
        return catchHandler(error, res);

    }
};

export const getUserStreak = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) {
            return errorHandler(res, "user Not found", 404)
        }

        const streak = await StreakModel.findOne({ userId: userId });
        if (!streak) {
            return successHandler(res,
                {
                    currentStreak: 0,
                    longestStreak: 0
                }, "streak retrived successfully")
        }

        return successHandler(res, {
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak
        }, "streak retrived successfully")

    } catch (error) {
        return catchHandler(error, res)
    }
};