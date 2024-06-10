import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Candidates } from "../Models/Candidate.js";
import { Employers } from "../Models/Employer.js";

const verifyMail = async (req, res, next) => {
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
const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
      const { userId } = decoded;

      const candidate = await Candidates.findOne({ _id: userId });
      const employer = await Employers.findOne({_id : userId})
      if (candidate) {
        req.userId = userId;
        req.candidate = candidate;
        return next();
      }
      else if(employer){
        req.userId = userId;
        req.employer = employer;
        next()
      } else {
        return res.status(200).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(200).json({ success: false, message: 'Invalid token' });
    }
  } else {
    return res.status(200).json({ success: false, message: 'Token not provided' });
  }
};


export { verifyMail, isAuthenticated };
