import { catchHandler, errorHandler } from '../../utils/ErrorHandler.js'
import { successHandler } from '../../utils/sucessHandler.js'
import DiscussionModel from '../../models/discussion.model.js'
import Submission from "../../models/Submission.model.js";
import mongoose from 'mongoose';
// import User from '../../models/User.js'

export const createParentDiscussion = async (req, res) => {
    try {
        const { userId, submissionId, type, title, topic, comment } = req.body;

        // Validate user
        if (!userId) {
            return errorHandler(res, "User ID is required", 400);
        }

        if (!title || !topic || !comment) {
            return errorHandler(res, "Title ,comment and topic are required for all discussions", 400);
        }

        // Prepare the discussion object
        const discussionData = {
            userId,
            type,
            comment,
            title,
            topic,
            ancestorCount: 0
        };

        // Handle discussion types
        if (type === 'general') {
            // Do Nothing
        } else if (type === 'solution') {
            if (!submissionId) {
                return errorHandler(res, "SubmissionId is required for solution discussions", 400);
            }
            const findSubmission = await Submission.findById(submissionId);
            if (!findSubmission) {
                return errorHandler(res, "Submission not found", 404);
            }
            discussionData.submissionId = submissionId;
        } else {
            return errorHandler(res, "Invalid discussion type", 400);
        }

        const newDiscussion = new DiscussionModel(discussionData);
        await newDiscussion.save();

        return successHandler(res, newDiscussion, "Parent discussion created successfully");
    } catch (error) {
        console.error('Error in createParentDiscussion:', error);
        return catchHandler(error, res);
    }
};

export const createNestedReply = async (req, res) => {
    try {
        const { userId, parentId, comment } = req.body;

        // Validate user
        // const user = await User.findById(userId);
        if (!userId) {
            return errorHandler(res, "User not found", 404)
        }

        // Find parent discussion
        const parentDiscussion = await DiscussionModel.findById(parentId);
        if (!parentDiscussion) {
            return errorHandler(res, "Parent discussion not found")
        }

        // Check maximum nesting depth
        const MAX_DEPTH = 5;
        if (parentDiscussion.ancestorCount >= MAX_DEPTH) {
            return errorHandler(res, "Maximum comment depth reached")
        }

        // Prepare the reply object
        const replyData = {
            userId,
            parent: parentId,
            type: parentDiscussion.type,
            comment,
            ancestorCount: parentDiscussion.ancestorCount + 1
        };

        // If parent has a submissionId, include it in the reply
        if (parentDiscussion.submissionId) {
            replyData.submissionId = parentDiscussion.submissionId;
        }

        // Create the new reply
        const newReply = new DiscussionModel(replyData);
        await newReply.save();

        // Update parent's children array
        await DiscussionModel.findByIdAndUpdate(parentId, {
            $push: { children: newReply._id }
        });

        return successHandler(res, newReply, "Reply added successfully")
    } catch (error) {
        console.error('Error in createNestedReply:', error);
        return catchHandler(error, res)
    }
};

export const getGeneralDiscussions = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const findGeneralDiscussions = await DiscussionModel.find({
            type: 'general',
            parent: { $exists: false }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            // .populate('userId', 'username')  
            .lean();

        if (!findGeneralDiscussions) {
            errorHandler(res, "No General Discussion Exist")
            return
        }


        const total = await DiscussionModel.countDocuments({
            type: 'general',
            parent: { $exists: false }
        });

        const paginationInfo = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };

        return successHandler(
            res,
            {
                discussions: findGeneralDiscussions,
                pagination: paginationInfo
            },
            "Discussions retrieved successfully");
    } catch (error) {
        return catchHandler(error, res);
    }
};

const populateChildren = async (discussion) => {
    if (discussion.children && discussion.children.length > 0) {
        await DiscussionModel.populate(discussion, {
            path: 'children',
            populate: [
                {
                    path: 'children'
                }
            ]
        });

        for (const child of discussion.children) {
            await populateChildren(child);
        }
    }
};


export const getDiscussionsBySolution = async (req, res) => {
    try {
        const { id: submissionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(submissionId)) {
            return errorHandler(res, "Invalid Submission ID format");
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const discussions = await DiscussionModel.find({ submissionId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            // .populate('userId', 'username')  
            .lean();

        for (let discussion of discussions) {
            await populateChildren(discussion);
        }

        const total = await DiscussionModel.countDocuments({
            submissionId
        });

        if (!discussions) {
            return successHandler(res, { discussions: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } }, "No discussions found for this solution");
        }

        const paginationInfo = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };

        return successHandler(res, { discussions, pagination: paginationInfo }, "Discussions retrieved successfully");
    } catch (error) {
        return catchHandler(error, res);
    }
};

export const getAllDiscussion = async (req, res) => {
    try {
        const findAllDiscussion = await DiscussionModel.find({});

        return successHandler(res, findAllDiscussion)
    } catch (error) {
        return catchHandler(error, res)
    }
}
