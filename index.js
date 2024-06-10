import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import candidate from "./Routes/Candidate.js";
import employer from "./Routes/Employer.js";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = "/uploads";

const app = express();

//env variables
config();
config({
  path: ".env",
});


const DB =
  "mongodb+srv://sujalchahande3:Smith%40710@cluster0.bis5mkj.mongodb.net/Data?retryWrites=true&w=majority&appName=Cluster0";
let db = "not connected";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);
    db = "connected";
    console.log("Connected to MongoDB established");
  } catch (err) {
    console.log("Connection not established with mongoDB");
  }
};
connectDB();

//Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // to handle JSON payloads
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, uploadDirectory)));

//CORS
app.use(
  cors({
    origin: "https://staff-merge-frontend.vercel.app", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

//Routes
app.use("/api/candidate/", candidate);
app.use("/api/employer/", employer);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
}
app.get("/", (req, res) => {
  res.json({ message: "Welcome To StaffMerge", atlas: { db } });
});

app.listen(8000, () => {
  console.log("listening on port 3000");
});

export default app;
