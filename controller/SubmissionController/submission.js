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

// Get a single submission by ID
export const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;

        const submission = await Submission.findById(id)
            .populate('problem')
            .populate('user')
            .populate('solution.language');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: "Submisssion fetched succesfully ",
            data: submission,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

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
