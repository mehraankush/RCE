import { Router } from "express";

const router = Router();
import {addTestCase,getTestCasesById} from "../controller/testCaseController/testcase.controller.js";

router.post("/add", addTestCase);
router.post("/get", getTestCasesById);

export default router;
