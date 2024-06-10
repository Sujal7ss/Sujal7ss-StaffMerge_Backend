import express from "express";
import {signup,login,  jobList} from "../Controllers/Candidate.js";

const router = express.Router();

router.post("/signup",  signup);
router.post("/login", login);
router.get("/joblist", jobList);

export default router;