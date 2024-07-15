import { Router } from "express";
import {
    addSolutionDriver,
    createProblem,
    deleteProblem,
    getAllProblems,
    getProblemBySlug,
    updateProblem,
    updateSolutionDriver
}
    from "../controller/problemController/problem.conroller.js";
const router = Router();


router.post('/create-question', createProblem)
router.post('/add-solution/:id', addSolutionDriver)
router.put('/update-solution/:id', updateSolutionDriver)
router.get('/', getAllProblems)
router.get('/:slug', getProblemBySlug)
router.put('/:id', updateProblem)
router.delete('/', deleteProblem)

export default router;
