import mongoose from "mongoose";
import ProblemModel from "../../models/Problem.model.js";
import TestcasesModel from "../../models/Testcases.model.js";
import { catchHandler, errorHandler } from "../../utils/ErrorHandler.js";
import { successHandler } from "../../utils/sucessHandler.js";

export const addTestCase = async (req, res) => {
	try {
		// Validate required fields
		const { problemId, input, output } = req.body;
		if (!problemId || !input || !output) {
			throw new Error(
				"400: Bad Request - Problem, Input, and Output are required."
			);
		}

		// Find the associated Problem document
		console.log(problemId);
		const problem = await ProblemModel.findOne({
			_id: problemId,
		});
		console.log("YAHA TAK AYA");
		if (!problem) {
			throw new Error(
				"404: Not Found - Problem with the specified ID does not exist."
			);
		}
		// Check if test case with the same input already exists

		const existingTestCase = await TestcasesModel.findOne({
			problem: new mongoose.Types.ObjectId(problemId),
		});
		console.log("EXISTING TEST CASE", existingTestCase);
		if (existingTestCase) {
			// Test case found, update its output

			existingTestCase.testCase.push({
				input: input.trim(),
				output: output.trim(),
			});
			await existingTestCase.save();

			return successHandler(res, { existingTestCase }, "Test case updated successfully.")
		} else {
			// Test case not found, create a new one
			const newTestCase = await TestcasesModel.create({
				problem: new mongoose.Types.ObjectId(problemId),
				testCase: [
					{
						input: input,
						output: output,
					},
				],
			});
			problem.testCase = newTestCase._id;
			await problem.save();
		}

		return successHandler(res, { newTestCase, problem }, "Test case created successfully.")
	} catch (error) {
		console.error(error.message);
		return catchHandler(error, res)
	}
};

export const getTestCasesById = async (req, res) => {
	try {
		const { problemId } = req.body;

		if (!mongoose.Types.ObjectId.isValid(problemId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid problem ID"
			});
		}

		const findTestCases = await TestcasesModel.find({ problem: problemId }).lean();

		if (!findTestCases || findTestCases.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Test Cases not found"
			});
		}

		res.status(200).json({
			success: true,
			message: "Present test cases",
			data: findTestCases
		});
	} catch (error) {
		console.log("Error in getting test cases:", error.message);
		res.status(500).json({
			success: false,
			message: "Error in getting test cases",
			data: error.message
		});
	}
};


export const updateTestCase = async (req, res) => {
	try {
		const { id:testCAseId } = req.params;
		const { input, output, explanation ,id} = req.body;

		if (!input && !output && !explanation) {
			return errorHandler(res, "At least one field is required: input, output, or explanation");
		}

		const findTestCase = await TestcasesModel.findById(testCAseId);
		if (!findTestCase) {
			return errorHandler(res, "Test Case not found", 404);
		}
		const specificTestCase = findTestCase.testCase.id(id);

        if (!specificTestCase) {
            return errorHandler(res, "Specific Test Case not found", 404);
        }

		if (input) {
			specificTestCase.input = input;
		}
		if (output) {
			specificTestCase.output = output;
		}
		if (explanation) {
			specificTestCase.explaination = explanation;
		}

		await findTestCase.save();

		return successHandler(res, findTestCase, "Test Case updated successfully");
	} catch (error) {
		return catchHandler(error, res);
	}
}
