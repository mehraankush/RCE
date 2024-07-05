import { Router } from "express";
import {
	createProgrammingLanguage,
	getAllProgrammingLanguages,
	getProgrammingLanguageById,
	updateProgrammingLanguage,
	deleteProgrammingLanguage
} from '../controller/languageController/language.controller.js'
const router = Router();


router.post("/", createProgrammingLanguage);
router.get("/", getAllProgrammingLanguages);
router.get("/:id", getProgrammingLanguageById);
router.put("/:id", updateProgrammingLanguage);
router.delete("/:id", deleteProgrammingLanguage);

export default router;
