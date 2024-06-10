import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const CandidatesSchema = new mongoose.Schema({
  name: String,
  role:String,
  description:String,
  password: String,
  city: String,
  state: String,
  country: String,
  email: String,
  phone: Number,
  skills: [String],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  appliedJobs: [ {type:Object}]
});

CandidatesSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

export const Candidates = mongoose.model("Candidates", CandidatesSchema);
