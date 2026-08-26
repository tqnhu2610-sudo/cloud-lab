import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: [true, "MSSV khong duoc de trong"],
            trim: true,
            unique: true
        },

        name: {
            type: String,
            required: [true, "Ho ten khong duoc de trong"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email khong duoc de trong"],
            trim: true,
            lowercase: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;