import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
	{
		problem: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Problem",
			required: true,
		},
		testCase: [
			{
				input: {
					type: String,
				},
				output: {
					type: String,
				},
				explaination: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);
export default mongoose.model("TestCase", testCaseSchema);
