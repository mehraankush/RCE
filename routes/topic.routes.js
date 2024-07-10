import { Router } from "express";
import {
    createTopic,
    getTopicBySlug,
    updateTopicBySlug,
    deleteTopicBySlug,
    getAlltopics
} from "../controller/TopicsController/topics.js";
const router = Router();


router.get('/', getAlltopics)
router.post('/', createTopic)
router.get('/:slug', getTopicBySlug)
router.put('/:slug', updateTopicBySlug)
router.delete('/:slug', deleteTopicBySlug)

export default router;
