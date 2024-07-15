import { Router } from "express";

const router = Router();
import {
    addTestCase,
    getTestCasesById,
    updateTestCase
} from "../controller/testCaseController/testcase.controller.js";

router.post("/add", addTestCase);
router.post("/get", getTestCasesById);
router.put("/update/:id", updateTestCase);

export default router;
