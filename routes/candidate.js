import express from "express";
import { signup, login, aboutme , update, jobList, jobDetail, appliedJobs, appliedCandidates, sendMail, getResume} from "../Controllers/Candidate.js";
import {applyJob} from "../Controllers/Job.js"
import {isAuthenticated, verifyMail} from "../Middleware/verifyMail.js"
import uploadResume from '../Middleware/file.js'
// import { auth } from "../Middleware/auth.js";




const router = express.Router();

router.post("/signup",  signup);
router.post("/login", login);
router.get("/aboutme", isAuthenticated,  aboutme);
router.post("/update",  update);
router.get("/joblist", jobList);
router.get("/jobDetails/:id", jobDetail)
router.post("/apply", uploadResume , applyJob)
router.get("/appliedJobs", isAuthenticated, appliedJobs)
router.post("/appliedCandidates", appliedCandidates)
router.get("/resume/:id", getResume)

router.get('/mail', sendMail)


export default router;
