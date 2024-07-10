import bcrypt from "bcryptjs";
import { Employers } from "../Models/Employer.js";
import jwt from "jsonwebtoken";

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
    const user = await Employers.findOne({ email: email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not exists",
      });
    } else {
      // console.log(result.companyName)
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { userId: user._id.toString() },
          process.env.JWTSECRETKEY
        );

        return res
          .cookie("token", token, {
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true, // Send cookie only over HTTPS
            sameSite: "None", // Needed for cross-site cookie
          })
          .status(200)
          .json({
            success: true,
            message: "Login successful",
            company: user.companyName,
          });
      } else {
        return res.status(200).json({
          success: false,
          message: "Password Incorrect",
        });
      }
    }
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: "Password Incorrect",
    });
  }
};

export const logout = (req, res) =>  {
  res.cookie('token', ""); // Assuming 'token' is the name of your cookie
  res.status(200).send({ message: 'Logout successful' });
}