import mongoose from "mongoose";
import ProblemModel from "../../models/Problem.model.js";
import TestcasesModel from "../../models/Testcases.model.js";

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
			res.status(200).json({
				success: true,
				message: "Test case updated successfully.",
				data: existingTestCase,
			});
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
			console.log("AFTER TESTCASE ADDING", problem);
			await problem.save();
			res.status(201).json({
				success: true,
				message: "Test case created successfully.",
				data: newTestCase,
			});
		}
	} catch (error) {
		console.error(error.message); // Log the error for debugging
		// let errorMessage;
		// if (error.name === "ValidationError") {
		// 	errorMessage = "400: Bad Request - Validation failed."; // Generic for validation errors
		// } else if (error.name === "CastError") {
		// 	errorMessage = "400: Bad Request - Invalid data format."; // For casting errors
		// } else {
		// 	errorMessage =
		// 		"500: Internal Server Error - An unexpected error occurred.";
		// }
		return res.status(500).json({ success: false, message: error.message });
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



