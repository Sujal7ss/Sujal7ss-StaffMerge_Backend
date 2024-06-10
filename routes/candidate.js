import express from "express";
import {signup,login,  jobList, aboutme, update, jobDetail, appliedJobs} from "../Controllers/Candidate.js";
import {applyJob} from "../Controllers/Job.js";
import {isAuthenticated} from "../Middleware/verifyMail.js";
import uploadResume from '../Middleware/file.js';

const router = express.Router();

router.post("/signup",  signup);
router.post("/login", login);
router.get("/aboutme", isAuthenticated,  aboutme);
router.post("/update",  update);
router.get("/joblist", jobList);
router.get("/jobDetails/:id", jobDetail)
router.post("/apply", uploadResume , applyJob)
router.get("/appliedJobs", isAuthenticated, appliedJobs)

export default router;