import { Router } from "express";
import {
    getAllSubmissions,
    updateSubmission,
    deleteSubmission,
    getSubmissionsByProblemSlug
} from "../controller/SubmissionController/submission.js";
const router = Router();


router.get('/', getAllSubmissions)
router.post('/get-submission', getSubmissionsByProblemSlug)
router.put('/:id', updateSubmission)
router.delete('/:id', deleteSubmission)

export default router;
