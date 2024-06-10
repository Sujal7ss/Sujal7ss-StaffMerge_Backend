import mongoose from "mongoose";

const JobSchema = mongoose.Schema({
    title:String,
    jobType:String,
    experience: Number,
    salary : Number,
    jobDescription:String,
    authorId: String,
    companyName : String,
    city:String,
    state:String,
    country:String,
    appliedCandidates : [
        {type:String}
    ],
    selectedCandidate:[
        {type:String}
    ],
})

export const Jobs = mongoose.model("Jobs", JobSchema)