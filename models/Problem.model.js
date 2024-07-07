import mongoose from "mongoose";
import { problemDifficulties } from "../enum/difficulty.enum.js";

const problemSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		difficulty: {
			type: String,
			enum: problemDifficulties,
			required: true,
		},
		constraints: {
			type: String,
		},
		tags: {
			type: [String],
			required: true,
		},
		// TODO : Can be in a different model
		companies: {
			type: [String],
			required: true,
		},
		problem: [
			{
				ProgrammingLanguage: {
					type: mongoose.Types.ObjectId,
					ref: "ProgrammingLanguage",
				},
				topDriver: {
					type: String,
					required: true,
				},
				boilerplate: {
					type: String,
					required: true,
				},
				bottomDriver: {
					type: String,
					required: true,
				},
				solutionCode: {
					type: String,
					required: true,
				},
			},
		],
		hints: {
			type: String,
		},
		testCase: {
			type: mongoose.Types.ObjectId,
			ref: "TestCase",
		},
		acceptance: {
			type: String,
		},
		submissions: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Problem", problemSchema);
