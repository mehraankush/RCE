import { Router } from "express";
import { getUserStreak 
    
} from "../controller/streakController/streak.js";
const router = Router();


router.get('/', getUserStreak)

export default router;
