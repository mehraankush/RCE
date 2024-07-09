import mongoose from "mongoose";
import ProblemModel from "../../models/Problem.model.js";
import { createSlug } from '../../utils/createSlug.js'
import { validateProblemInput } from "../../utils/validation/problemInputValidator.js";


export const createProblem = async (req, res) => {
	try {
		const {
			title,
			description,
			difficulty,
			tags,
			companies,
			topDriver,
			boilerplate,
			bottomDriver,
			solutionCode,
			hints,
			language,
			constraints,
			testCase
		} = req.body;

		// Input validation
		const validationError = validateProblemInput(req.body);
		if (validationError) {
			throw new Error(validationError);
		}

		const slug = createSlug(title);
		// console.log(title);
		// console.log("SLUG:", slug);

		// Create problem
		const newProblem = await ProblemModel.create({
			title,
			slug: slug,
			description,
			difficulty,
			tags: tags.split(",").map((tag) => tag.trim()),
			slug: title.replaceAll(" ", "-").toLowerCase(),
			companies: companies.split(",").map((company) => company.trim()),
			problem: {
				ProgrammingLanguage: new mongoose.Types.ObjectId(language),
				topDriver,
				boilerplate,
				bottomDriver,
				solutionCode,
			},
			hints: hints ? hints.trim() : null,
			testCase: testCase ? new mongoose.Types.ObjectId(testCase) : null,
			constraints: constraints
		});

		return res.status(200).json({
			success: true,
			message: `New Problem "${title}" Added`,
			data: newProblem,
		});

	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
};


export const getAllProblems = async (req, res) => {
	try {

		const { title, difficulty, page = 1, limit = 10 } = req.query;

		const skip = (page - 1) * limit;

		// Build the filter query
		let filter = {};
		if (title) {
			filter.title = { $regex: title, $options: 'i' };
		}
		if (difficulty) {
			filter.difficulty = { $regex: difficulty, $options: 'i' };
		}

		const allProblems = await ProblemModel.find(filter)
			.skip(skip)
			.limit(limit);

		const totalProblems = await ProblemModel.countDocuments(filter);

		return res.status(200).json({
			success: true,
			message: `All problems`,
			totalProblems,
			currentPage: page,
			totalPages: Math.ceil(totalProblems / limit),
			data: allProblems,
		});

	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
}

export const getProblemBySlug = async (req, res) => {
	try {
		const { slug } = req.params;

		const findProblem = await ProblemModel.findOne({ slug: slug })
			.populate('testCase')
			.populate('problem.ProgrammingLanguage')
			.lean();

		if (!findProblem) {
			return res.status(404).json({
				success: false,
				message: `Problem not found, try a different slug`,
				slug: slug
			});
		}

		return res.status(200).json({
			success: true,
			message: `Problem found`,
			problem: findProblem
		});

	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
}

export const updateProblem = async (req, res) => {
	try {
		const {
			title,
			description,
			difficulty,
			tags,
			companies,
			topDriver,
			boilerplate,
			bottomDriver,
			solutionCode,
			hints,
			ProgrammingLanguage,
			testCase
		} = req.body;

		const { id: problemId } = req.params

		if (!mongoose.Types.ObjectId.isValid(problemId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid problem ID",
				data: null,
			});
		}

		// Find the existing problem
		const existingProblem = await ProblemModel.findById(problemId);
		if (!existingProblem) {
			return res.status(404).json({
				success: false,
				message: "Problem not found",
				data: null,
			});
		}

		// Update problem details
		existingProblem.title = title || existingProblem.title;
		existingProblem.description = description || existingProblem.description;
		existingProblem.difficulty = difficulty || existingProblem.difficulty;
		existingProblem.tags = tags ? tags.split(",").map((tag) => tag.trim()) : existingProblem.tags;
		existingProblem.companies = companies ? companies.split(",").map((company) => company.trim()) : existingProblem.companies;

		if (ProgrammingLanguage || topDriver || boilerplate || bottomDriver || solutionCode) {
			existingProblem.problem[0].ProgrammingLanguage = ProgrammingLanguage ? new mongoose.Types.ObjectId(ProgrammingLanguage) : existingProblem.problem[0].ProgrammingLanguage;
			existingProblem.problem[0].topDriver = topDriver || existingProblem.problem[0].topDriver;
			existingProblem.problem[0].boilerplate = boilerplate || existingProblem.problem[0].boilerplate;
			existingProblem.problem[0].bottomDriver = bottomDriver || existingProblem.problem[0].bottomDriver;
			existingProblem.problem[0].solutionCode = solutionCode || existingProblem.problem[0].solutionCode;
		}

		existingProblem.hints = hints ? hints.trim() : existingProblem.hints;
		existingProblem.testCase = testCase ? new mongoose.Types.ObjectId(testCase) : existingProblem.testCase;

		// Save the updated problem
		const updatedProblem = await existingProblem.save();

		return res.status(200).json({
			success: true,
			message: `Problem "${title || existingProblem.title}" updated successfully`,
			data: updatedProblem,
		});

	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
};


export const deleteProblem = async (req, res) => {
	try {
		const { problemId } = req.body;
		// Validate problem ID
		if (!mongoose.Types.ObjectId.isValid(problemId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid problem ID"
			});
		}

		// Find and delete problem
		const deletedProblem = await ProblemModel.findByIdAndDelete(problemId);

		if (!deletedProblem) {
			return res.status(404).json({
				success: false,
				message: "Problem not found"
			});
		}

		return res.status(200).json({
			success: true,
			message: `Problem "${deletedProblem.title}" has been deleted`,
			data: deletedProblem,
		});

	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
};
