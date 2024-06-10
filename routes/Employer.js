import express from 'express';
import {signup, login} from '../Controllers/Employer.js'
import {companyDetails, companyData, companyDataUpdate} from '../Controllers/Company.js'
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/companyDetails", companyDetails);
// router.get("/companyDetails", companyData)
// router.post("/jobDetails", jobDetails);
// router.post("/companyDetails", companyDataUpdate)
// router.get("/postedJobs", postedJobs)

// router.post("/editJob/:id", editJob)
// router.get("/selectCandidate", selectCandidate)

export default router