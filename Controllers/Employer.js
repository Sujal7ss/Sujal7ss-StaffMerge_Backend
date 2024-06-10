import bcrypt from "bcryptjs";
import { Employers } from "../Models/Employer.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const result = await Employers.find({ email: email });

    if (result.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      const employer = new Employers({
        name: name,
        email: email,
        password: hash,
      });
      employer.save();

      return res.status(200).json({
        success: true,
        message: "Successfully signed up",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Email already exists",
      });
    }
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await Employers.findOne({ email: email });
    // console.log(result)
    if (!result ) {
      return res.status(200).json({
        success: false,
        message: "User not exists",
      });
    } else {
      // console.log(result.companyName)
      const isMatch = await bcrypt.compare(password, result.password);
      if (isMatch) {
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            company: result,
        })
      }
      else{
        return res.status(200).json({
            success : false,
            message: "Password Incorrect"
        })
      }
    }
  } catch (err) {
    return res.status(200).json({
      success : false,
      message: "Password Incorrect"
  })
  }
};
