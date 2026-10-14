
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Student from "./models/Student.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// CORS: cho phep frontend local va Render
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origin khong duoc phep boi CORS"));
    },
  })
);

app.use(express.json());

// Kiem tra backend
app.get("/", (req, res) => {
  res.send("Backend MERN dang hoat dong!");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend dang hoat dong!" });
});

// GET: Lay danh sach sinh vien
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error("Loi lay danh sach sinh vien:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST: Them sinh vien
app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui long nhap day du MSSV, ho ten va email",
      });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Loi them sinh vien:", error);
    res.status(400).json({ message: error.message });
  }
});

// PUT: Cap nhat sinh vien
app.put("/api/students/:id", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { studentId, name, email },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Khong tim thay sinh vien",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Loi cap nhat sinh vien:", error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Xoa sinh vien
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Khong tim thay sinh vien",
      });
    }

    res.status(200).json({
      message: "Xoa sinh vien thanh cong",
    });
  } catch (error) {
    console.error("Loi xoa sinh vien:", error);
    res.status(400).json({ message: error.message });
  }
});

// Ket noi MongoDB va khoi dong server
if (!MONGODB_URI) {
  console.error("Loi: MONGODB_URI chua duoc khai bao!");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server dang chay tai port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
