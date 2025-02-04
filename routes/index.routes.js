import { Router } from "express";
const router = Router();
import problemRoute from './problems.routes.js'
import languageRoute from './languages.routes.js'
import testCAsesRote from './testcases.routes.js'
import codeExecutionROute from './codeExecution.routes.js'
import submissionROute from './submission.routes.js'
import topicsRoute from './topic.routes.js'
import discussionRoute from './discussion.routes.js'
import streakRoute from './streak.routes.js'

router.use('/problem', problemRoute);
router.use('/programming-languages', languageRoute);
router.use('/code', codeExecutionROute);
router.use('/test', testCAsesRote);
router.use('/submission', submissionROute);
router.use('/topic',topicsRoute );
router.use('/discussion',discussionRoute);
router.use('/streak',streakRoute);

router.get('/helloWorld', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Test route"
    })
})

export default router;
