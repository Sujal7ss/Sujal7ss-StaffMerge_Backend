import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import candidate from "./routes/candidate.js";
import employer from "./routes/employer.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = "/uploads";

const app = express();

const DB =process.env.CONNECTION_STRING
const PORT = process.env.PORT || 8000
  
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
// origin: "https://staff-merge-frontend.vercel.app",
// origin: "http://localhost:3000",    
app.use(
  cors({
    origin: "https://staff-merge-frontend.vercel.app",    
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

//Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // to handle JSON payloads
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, uploadDirectory)));

app.use("/api/candidate/", candidate);
app.use("/api/employer/", employer)

app.get("/", (req, res) => {
  res.json({ message: "Welcome To StaffMerge", atlas: { db } });
});

app.listen(PORT, () => {
  console.log("listening on port 8000");
});

export default app;
