import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Candidates } from "../Models/Candidate.js";
import { Employers } from "../Models/Employer.js";


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


export {  isAuthenticated };
