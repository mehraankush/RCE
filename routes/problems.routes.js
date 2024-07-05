import { Router } from "express";
import {
    createProblem,
    deleteProblem,
    getAllProblems,
    updateProblem
}
    from "../controller/problemController/problem.conroller.js";
const router = Router();


router.post('/', createProblem)
router.get('/', getAllProblems)
router.put('/', updateProblem)
router.delete('/', deleteProblem)

export default router;
