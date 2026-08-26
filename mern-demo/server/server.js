import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Student from "./models/Student.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;


// API KIEM TRA BACKEND
app.get("/api/hello", (req, res) => {
    res.send("Backend dang hoat dong!");
});


// API LAY DANH SACH SINH VIEN
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.status(200).json(students);

    } catch (error) {
        console.error("Loi lay danh sach:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// API THEM SINH VIEN
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create({
            studentId: req.body.studentId,
            name: req.body.name,
            email: req.body.email
        });

        res.status(201).json(student);

    } catch (error) {
        console.error("Loi them sinh vien:", error);

        res.status(400).json({
            message: error.message
        });
    }
});


// API CAP NHAT SINH VIEN
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                studentId: req.body.studentId,
                name: req.body.name,
                email: req.body.email
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Khong tim thay sinh vien"
            });
        }

        res.status(200).json(student);

    } catch (error) {
        console.error("Loi cap nhat sinh vien:", error);

        res.status(400).json({
            message: error.message
        });
    }
});


// API XOA SINH VIEN
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Khong tim thay sinh vien"
            });
        }

        res.status(200).json({
            message: "Xoa sinh vien thanh cong"
        });

    } catch (error) {
        console.error("Loi xoa sinh vien:", error);

        res.status(400).json({
            message: error.message
        });
    }
});


// KET NOI MONGODB VA KHOI DONG SERVER
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server dang chay tai port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });