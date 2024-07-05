import { Router } from "express";
import {
    getAllSubmissions,
    getSubmissionById,
    updateSubmission,
    deleteSubmission
} from "../controller/SubmissionController/submission.js";
const router = Router();


router.get('/', getAllSubmissions)
router.get('/:id', getSubmissionById)
router.put('/:id', updateSubmission)
router.delete('/:id', deleteSubmission)

export default router;
