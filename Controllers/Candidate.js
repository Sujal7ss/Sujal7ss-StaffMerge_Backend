import { Candidates } from "../Models/Candidate.js";
import { Jobs } from "../Models/Job.js";
import { sendWelcomeEmail } from "./mail.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, "../uploads");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
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

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body)
  try {
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
    console.log(list);
    res.status(200).json({
      success: true,
      jobs: list,
    });
  } catch (err) {
    console.log(err);
  }
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

const jobDetail = async (req, res) => {
  const jobId = req.params.id;

  const job = await Jobs.findOne({ _id: jobId });

  res.status(200).json({
    success: true,
    job: job,
  });
};
const appliedCandidates = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails) {
      return res.status(200).json({
        success: false,
        message: "Something went wrong",
        candidates: [],
      });
    }

    const candidates = [];
    for (let i = 0; i < emails.length; i++) {
      const candidate = await Candidates.findOne({ email: emails[i] });
      candidates.push(candidate);
    }

    res.status(200).json({
      success: true,
      message: "Applied Candidates",
      candidates: candidates,
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: "Something went wrong",
      candidates: [],
    });
  }
};

const sendMail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "brielle.trantow@ethereal.email",
      pass: "DXfe53hx8maaCYcVgc",
    },
  });

  async function mail() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    res.send(info);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  mail().catch(console.error);
};

const getResume = (req, res) => {
  const userId = req.body.userId || req.params.id;
  const filePath = path.join(uploadDirectory, `${userId}.pdf`);
  console.log(filePath);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', filePath);
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    console.log("file Exists")
    // If file exists, send the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('File send error:', err);
        res.status(500).json({
          success: false,
          message: 'Error sending the file',
        });
      }
    })
  });
};

export {
  login,
  signup,
  aboutme,
  update,
  jobList,
  jobDetail,
  appliedJobs,
  appliedCandidates,
  sendMail,
  getResume,
};
