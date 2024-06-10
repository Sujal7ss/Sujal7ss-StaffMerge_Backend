import express from "express";
import {jobList} from "../Controllers/Candidate.js";

const router = express.Router();

router.get("/joblist", jobList);

export default router;