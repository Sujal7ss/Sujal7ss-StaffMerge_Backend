import { Jobs } from "../Models/Job.js";
import { Candidates } from "../Models/Candidate.js";
import { sendWelcomeEmail } from "./mail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password } = req.body;
    const isUserExist = await Candidates.findOne({ email: email });
    if (isUserExist) {
      return res.status(200).json({
        success: false,
        message: "User already exist",
      });
    }

    if (password.length < 8 || password.length > 20) {
      console.log("password is short");
      return res.status(200).json({
        success: false,
        message: "Password too short",
      });
    }

    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // console.log(otp)
    sendWelcomeEmail(email);

    const hash = await bcrypt.hash(password, 10);

    const candidate = new Candidates({
      name: name,
      email: email,
      password: hash,
    });
    candidate.save();

    return res.status(200).json({
      success: true,
      message: "User created",
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Candidates.findOne({ email: email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWTSECRETKEY
      );

      // Set the token as a cookie
      return res
        .cookie("token", token, {
          httpOnly: false,
          maxAge: 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS
          sameSite: "None", // Needed for cross-site cookie
        })
        .status(200)
        .json({
          success: true,
          message: "User verified",
        });
    } else {
      return res.status(200).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const aboutme = async (req, res) => {
  // console.log(req.userId);

  if (req.candidate) {
    res
      .status(200)
      .json({ success: true, candidate: req.candidate, isAuthenticated: true });
  } else {
    res.status(200).json({ success: false, isAuthenticated: false });
  }
};

const update = async (req, res) => {
  const candidate = await Candidates.findOneAndUpdate(
    { email: req.body.email },
    req.body,
    { new: true }
  );

  res.json("update");
};

const jobList = async (req, res) => {
  try {
    const list = await Jobs.find({});
    res.status(200).json({
      success: true,
      jobs: list,
    });
  } catch (err) {
    console.log(err);
  }
};

const jobDetail = async (req, res) => {
  const jobId = req.params.id;

  const job = await Jobs.findOne({ _id: jobId });

  res.status(200).json({
    success: true,
    job: job,
  });
};

const appliedJobs = async (req, res) => {
  try {
    const list = req.candidate.appliedJobs;

    let jobList = []
    for(let i = 0; i < list.length; i++) {
      const job = await Jobs.findOne({_id : list[i]})
      jobList.push(job);
    }
    // console.log(list)
    res.status(200).json({
      success: true,
      jobs: jobList,
    });
  } catch (err) {
    console.log(err);
  }
};

export { jobList, signup, login, aboutme, update, jobDetail, appliedJobs};
