import { Router } from "express";
import {
    runCode,
    submitCode
} from "../controller/SubmissionController/executeCode.js";

const router = Router();


router.post("/run", runCode);
router.post("/submit", submitCode);


export default router;
