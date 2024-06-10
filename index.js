import express from "express";
import mongoose from "mongoose";
import candidate from "./routes/candidate.js";
import cors from "cors";
const app = express();

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

app.use(
  cors({
    origin: "https://staff-merge-frontend.vercel.app/", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/api/candidate/", candidate);

app.get("/", (req, res) => {
  res.json({ message: "Welcome To StaffMerge", atlas: { db } });
});

app.listen(8000, () => {
  console.log("listening on port 3000");
});

export default app;
