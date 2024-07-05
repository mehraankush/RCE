import { Router } from "express";
const router = Router();
import problemRoute from './problems.routes.js'
import languageRoute from './languages.routes.js'
import testCAsesRote from './testcases.routes.js'
import codeExecutionROute from './codeExecution.routes.js'
import submissionROute from './submission.routes.js'

router.use('/problem', problemRoute);
router.use('/programming-languages', languageRoute);
router.use('/code', codeExecutionROute);
router.use('/test', testCAsesRote);
router.use('/submission', submissionROute);

export default router;
