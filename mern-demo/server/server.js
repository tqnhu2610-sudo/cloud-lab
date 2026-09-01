import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Student from "./models/Student.js";

dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// CẤU HÌNH
// ===============================

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ===============================
// KIỂM TRA BACKEND
// ===============================

app.get("/", (req, res) => {
  res.send("Backend MERN đang hoạt động!");
});

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend đang hoạt động!",
  });
});

// ===============================
// LẤY DANH SÁCH SINH VIÊN
// GET /api/students
// ===============================

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    console.error("Lỗi lấy danh sách sinh viên:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// THÊM SINH VIÊN
// POST /api/students
// ===============================

app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    // KIỂM TRA DỮ LIỆU
    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ MSSV, họ tên và email",
      });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Lỗi thêm sinh viên:", error);

    res.status(400).json({
      message: error.message,
    });
  }
});

// CẬP NHẬT SINH VIÊN
const updateStudent = async (e) => {
  e.preventDefault();

  if (!studentId || !name || !email) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        name,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error("Không thể cập nhật sinh viên");
    }

    const updatedStudent = await response.json();

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === editingId
          ? updatedStudent
          : student
      )
    );

    // Xóa trạng thái sửa
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");

  } catch (err) {
    console.error(err);
    alert("Lỗi khi cập nhật sinh viên!");
  }
};

// HỦY SỬA
const cancelEdit = () => {
  setEditingId(null);
  setStudentId("");
  setName("");
  setEmail("");
};

// ===============================
// XÓA SINH VIÊN
// DELETE /api/students/:id
// ===============================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên",
      });
    }

    res.status(200).json({
      message: "Xóa sinh viên thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa sinh viên:", error);

    res.status(400).json({
      message: error.message,
    });
  }
});

// ===============================
// KẾT NỐI MONGODB VÀ CHẠY SERVER
// ===============================

if (!MONGODB_URI) {
  console.error("Lỗi: MONGODB_URI chưa được khai báo!");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server đang chạy tại port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });