import express from "express";
import {signup,login,  jobList, aboutme, update, jobDetail} from "../Controllers/Candidate.js";
import {isAuthenticated} from "../Middleware/verifyMail.js"

const router = express.Router();

router.post("/signup",  signup);
router.post("/login", login);
router.get("/aboutme", isAuthenticated,  aboutme);
router.post("/update",  update);
router.get("/joblist", jobList);
router.get("/jobDetails/:id", jobDetail)

export default router;