import multer from "multer";
import * as fs from "fs";
import jwt from "jsonwebtoken";
import { Candidates } from "../Models/Candidate.js";
import { Jobs } from "../Models/Job.js";
import { sendAppliedMail } from "../Controllers/mail.js"; // Assuming there's a mailer utility

const uploadDirectory = "uploads";

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    const { userId } = decoded;
    cb(null, `${userId}.pdf`);
  },
});

const upload = multer({ storage }).single("resume");

const uploadResume = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "File upload failed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
      const { userId } = decoded;

      const candidate = await Candidates.findById(userId);
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
        });
      }

      const job = await Jobs.findById(req.body.jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      if (job.appliedCandidates.includes(candidate.email)) {
        return res.status(400).json({
          success: false,
          message: "Already Applied",
        });
      }

      job.appliedCandidates.push(candidate.email);
      await job.save();

      if (
        !candidate.appliedJobs.some(
          (job) => job._id.toString() === req.body.jobId
        )
      ) {
        candidate.appliedJobs.push(job._id);
      } else {
        return res.status(400).json({
          success: false,
          message: "Already Applied",
        });
      }

      await candidate.save();

      sendAppliedMail(candidate.email, job.title, job.companyName);

      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
      });
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  });
};

export default uploadResume;
