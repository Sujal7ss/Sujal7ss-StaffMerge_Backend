import mongoose from "mongoose";

const EmployerSchema = mongoose.Schema({
    name : String,
    email: String,
    password: String,
    city : String,
    phone: Number,
    state : String,
    country : String,
    companyName : String,
    about: String,
    activeJobs : [
        {type : String,}
    ]
})

export const Employers = mongoose.model("Employer", EmployerSchema)