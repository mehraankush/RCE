import mongoose from "mongoose";
import ProblemModel from "../../models/Problem.model.js";
import Submission from "../../models/Submission.model.js";
import UserModel from "../../models/user.model.js";
import { errorHandler } from "../../utils/ErrorHandler.js";
import { successHandler } from "../../utils/sucessHandler.js";

// Get all submissions
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .populate("problem")
      .populate("solution.language");

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

// get submission by id
export const getAllSubmissionsById = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return errorHandler(res, "Submission ID is required")
    }
    const submissions = await Submission.findById(id)
      .populate("problem")
      .populate("solution.language");


    return successHandler(res, submissions, "Submissions Retrieved Successfully")
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
    const { problemSlug, userId } = req.body;
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    console.log(req.body);

    // Validate problemId
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      });
    }

    // Find the problem by ID
    const problem = await ProblemModel.find({ slug: problemSlug });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Find submissions for the found problem with pagination
    const submissions = await Submission.find({
      problem: problem._id,
      user: userId,
    })
      .populate("problem")
      .populate("solution.language")
      .sort({ createdAt: -1 });

    console.log(submissions);

    const totalSubmissions = await Submission.countDocuments({
      problem: problem._id,
      user: userId,  // Ensure count is user-specific
    });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
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
      message: "Server Error: " + error.message,
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
      { "solution.code": code },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission updated successfully",
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
        message: "Submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission deleted successfully",
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
