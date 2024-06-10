import express from "express";
import {signup,login,  jobList, aboutme, update} from "../Controllers/Candidate.js";
import {isAuthenticated} from "../Middleware/verifyMail.js"

const router = express.Router();

router.post("/signup",  signup);
router.post("/login", login);
router.get("/aboutme", isAuthenticated,  aboutme);
router.post("/update",  update);
router.get("/joblist", jobList);

export default router;