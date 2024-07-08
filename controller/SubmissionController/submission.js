import ProblemModel from '../../models/Problem.model.js';
import Submission from '../../models/Submission.model.js';
import UserModel from '../../models/user.model.js';

// Get all submissions
export const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({})
            .populate('problem')
            .populate('user')
            .populate('solution.language');

        return res.status(200).json({
            success: true,
            message: "All Submissions",
            data: submissions,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// get submission by the problem slug
export const getSubmissionsByProblemSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        // Find the problem by slug
        const problem = await ProblemModel.findOne({ slug });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found',
            });
        }

        // Find submissions for the found problem with pagination
        const submissions = await Submission.find({ problem: problem._id })
            .populate('problem')
            .populate('user')
            .populate('solution.language')
            .skip((page - 1) * limit)
            .limit(limit);

        const totalSubmissions = await Submission.countDocuments({ problem: problem._id });

        return res.status(200).json({
            success: true,
            message: 'Submissions fetched successfully',
            data: submissions,
            pagination: {
                totalSubmissions,
                totalPages: Math.ceil(totalSubmissions / limit),
                currentPage: page,
                pageSize: limit,
            },
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Update a submission
export const updateSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { code } = req.body;

        const updatedSubmission = await Submission.findByIdAndUpdate(
            id,
            { 'solution.code': code },
            { new: true }
        );

        if (!updatedSubmission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Submission updated successfully',
            data: updatedSubmission,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete a submission
export const deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSubmission = await Submission.findByIdAndDelete(id);

        if (!deletedSubmission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Submission deleted successfully',
            data: deletedSubmission,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
