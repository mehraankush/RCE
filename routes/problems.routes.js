import { Router } from "express";
import {
    createProblem,
    deleteProblem,
    getAllProblems,
    getProblemBySlug,
    updateProblem
}
    from "../controller/problemController/problem.conroller.js";
const router = Router();


router.post('/create-question', createProblem)
router.get('/', getAllProblems)
router.get('/:slug', getProblemBySlug)
router.put('/:id', updateProblem)
router.delete('/', deleteProblem)

export default router;
