// Define the ProgrammingLanguage model
import ProgrammingLanguage from "../../models/Language.model.js";

// Request body validation function
function validateRequestBody(updates) {
    const allowedFields = ['programmingLanguage', 'languageId', 'language'];
    const providedFields = Object.keys(updates).filter(field => allowedFields.includes(field));

    if (providedFields.length === 0) {
        throw new Error('At least one field (programmingLanguage, languageId, language) must be provided.');
    }
}

// Create a new programming language
export async function createProgrammingLanguage(req, res) {
	try {
		// Validate request body
		validateRequestBody(req.body);

		// Create a new programming language instance
		const newLanguage = new ProgrammingLanguage(req.body);

		// Save the new language to the database
		const savedLanguage = await newLanguage.save();

		res.status(201).json({
			success: true,
			message: "Programming language created successfully",
			data: savedLanguage,
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
}

// Get all programming languages
export async function getAllProgrammingLanguages(req, res) {
	try {
		// Fetch all programming languages from the database
		const languages = await ProgrammingLanguage.find();

		res.json({
			success: true,
			message: "All programming languages fetched successfully",
			data: languages,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
}

// Get a programming language by ID
export async function getProgrammingLanguageById(req, res) {
	try {
		// Fetch a programming language by ID from the database
		const language = await ProgrammingLanguage.findById(req.params.id);

		if (!language) {
			return res.status(404).json({
				success: false,
				message: "Programming language not found",
				data: null,
			});
		}

		res.json({
			success: true,
			message: "Programming language found",
			data: language,
		});
	} catch (error) {
		console.error(error);
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				message: "Invalid programming language ID",
				data: null,
			});
		}
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
}

// Update a programming language by ID
export async function updateProgrammingLanguage(req, res) {
	const { id } = req.params;
	const updates = req.body;

	try {
		// Validate request body
		validateRequestBody(updates);

		// Update the programming language in the database
		const updatedLanguage = await ProgrammingLanguage.findByIdAndUpdate(
			id,
			updates,
			{ new: true }
		);

		if (!updatedLanguage) {
			return res.status(404).json({
				success: false,
				message: 'Programming language not found',
				data: null,
			});
		}

		res.json({
			success: true,
			message: 'Programming language updated successfully',
			data: updatedLanguage,
		});
	} catch (error) {
		console.error(error);
		if (error.name === 'CastError') {
			return res.status(400).json({
				success: false,
				message: 'Invalid programming language ID',
				data: null,
			});
		}
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
}
// Delete a programming language by ID
export async function deleteProgrammingLanguage(req, res) {
	const { id } = req.params;

	try {
		// Delete the programming language from the database
		const deletedLanguage = await ProgrammingLanguage.findByIdAndDelete(id);

		if (!deletedLanguage) {
			return res.status(404).json({
				success: false,
				message: "Programming language not found",
				data: null,
			});
		}

		res.json({
			success: true,
			message: "Programming language deleted successfully",
			data: null,
		});
	} catch (error) {
		console.error(error);
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				message: "Invalid programming language ID",
				data: null,
			});
		}
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
		});
	}
}
