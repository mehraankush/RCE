import { Router } from "express";
import {
    getAllSubmissions,
    updateSubmission,
    deleteSubmission,
    getSubmissionsByProblemSlug,
    getAllSubmissionsById
} from "../controller/SubmissionController/submission.js";
const router = Router();


router.get('/', getAllSubmissions)
router.get('/:id', getAllSubmissionsById)
router.post('/get-submission', getSubmissionsByProblemSlug)
router.put('/:id', updateSubmission)
router.delete('/:id', deleteSubmission)

export default router;
