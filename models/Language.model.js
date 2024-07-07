import mongoose from "mongoose";

const programmingLanguageSchema = new mongoose.Schema(
	{
		programmingLanguage: {
			type: String,
			required: true,
			trim: true,
		},
		languageId: {
			type: Number,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
export default mongoose.model("ProgrammingLanguage", programmingLanguageSchema);
