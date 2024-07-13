import { Router } from "express";
import {
    createNestedReply,
    createParentDiscussion,
    getAllDiscussion,
    getDiscussionsBySolution,
    getGeneralDiscussions
} from "../controller/DiscussionController/DiscussionController.js";
const router = Router();


router.post("/", createParentDiscussion);
router.post("/reply", createNestedReply);
router.get("/", getAllDiscussion);
router.get("/general", getGeneralDiscussions);
router.get("/:id", getDiscussionsBySolution);


export default router;
