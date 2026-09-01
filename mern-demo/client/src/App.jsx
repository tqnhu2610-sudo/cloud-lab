import { useEffect, useState } from "react";

function App() {
  // BACKEND API PORT 5000
  const API_URL =
    "https://fuzzy-space-computing-machine-wv94rv59rgpjfggg4-5000.app.github.dev/api/students";

  // DANH SÁCH SINH VIÊN
  const [students, setStudents] = useState([]);

  // DỮ LIỆU FORM
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ID SINH VIÊN ĐANG SỬA
  const [editingId, setEditingId] = useState(null);

  // TRẠNG THÁI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // LẤY DANH SÁCH SINH VIÊN
  // ================================
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Đang gọi API:", API_URL);

      const response = await fetch(API_URL);

      console.log("Status:", response.status);

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu sinh viên");
      }

      const data = await response.json();

      console.log("Dữ liệu từ Backend:", data);

      setStudents(data);
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Không kết nối được Backend!");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // CHẠY KHI MỞ ỨNG DỤNG
  // ================================
  useEffect(() => {
    fetchStudents();
  }, []);

  // ================================
  // THÊM SINH VIÊN
  // ================================
  const addStudent = async (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
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
        throw new Error("Không thể thêm sinh viên");
      }

      // Nhận sinh viên vừa tạo từ Backend
      const newStudent = await response.json();

      // Đưa sinh viên mới lên đầu
      setStudents((prevStudents) => [
        newStudent,
        ...prevStudents,
      ]);

      // Xóa form
      setStudentId("");
      setName("");
      setEmail("");

      alert("Thêm sinh viên thành công!");
    } catch (err) {
      console.error("Lỗi thêm sinh viên:", err);
      alert("Lỗi khi thêm sinh viên!");
    }
  };

  // ================================
  // BẮT ĐẦU SỬA SINH VIÊN
  // ================================
  const editStudent = (student) => {
    setEditingId(student._id);

    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);

    // Cuộn lên đầu để thấy form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================================
  // CẬP NHẬT SINH VIÊN
  // ================================
  const updateStudent = async (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            name,
            email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật sinh viên");
      }

      // Nhận dữ liệu sinh viên sau khi cập nhật
      const updatedStudent = await response.json();

      // Cập nhật sinh viên trong danh sách
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === editingId
            ? updatedStudent
            : student
        )
      );

      // Thoát chế độ sửa
      setEditingId(null);

      // Xóa form
      setStudentId("");
      setName("");
      setEmail("");

      alert("Cập nhật sinh viên thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Lỗi khi cập nhật sinh viên!");
    }
  };

  // ================================
  // HỦY SỬA
  // ================================
  const cancelEdit = () => {
    setEditingId(null);

    setStudentId("");
    setName("");
    setEmail("");
  };

  // ================================
  // XÓA SINH VIÊN
  // ================================
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa sinh viên");
      }

      // Xóa trực tiếp khỏi giao diện
      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student._id !== id
        )
      );

      alert("Xóa sinh viên thành công!");
    } catch (err) {
      console.error("Lỗi xóa:", err);
      alert("Lỗi khi xóa sinh viên!");
    }
  };

  // ================================
  // GIAO DIỆN
  // ================================
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1f212b",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
        }}
      >

        {/* TIÊU ĐỀ */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "42px",
          }}
        >
          Quản lý sinh viên - version 2.0
        </h1>

        {/* TIÊU ĐỀ FORM */}
        <h2
          style={{
            textAlign: "center",
          }}
        >
          {editingId
            ? "Sửa sinh viên"
            : "Thêm sinh viên"}
        </h2>

        {/* ================= FORM ================= */}
        <form
          onSubmit={
            editingId
              ? updateStudent
              : addStudent
          }
        >

          {/* MSSV */}
          <input
            type="text"
            placeholder="Nhập MSSV"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "12px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #777",
              background: "#3a3a3a",
              color: "white",
              fontSize: "16px",
            }}
          />

          {/* HỌ TÊN */}
          <input
            type="text"
            placeholder="Nhập họ tên"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "12px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #777",
              background: "#3a3a3a",
              color: "white",
              fontSize: "16px",
            }}
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "12px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #777",
              background: "#3a3a3a",
              color: "white",
              fontSize: "16px",
            }}
          />

          {/* NÚT THÊM / CẬP NHẬT */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "10px",
            }}
          >
            {editingId
              ? "Cập nhật sinh viên"
              : "Thêm sinh viên"}
          </button>

          {/* NÚT HỦY */}
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                width: "100%",
                padding: "14px",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              Hủy sửa
            </button>
          )}
        </form>

        {/* ================= DANH SÁCH ================= */}

        <h2
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Danh sách sinh viên
        </h2>

        {/* ĐANG TẢI */}
        {loading && (
          <p
            style={{
              textAlign: "center",
            }}
          >
            Đang tải dữ liệu...
          </p>
        )}

        {/* LỖI BACKEND */}
        {error && (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <p>{error}</p>

            <button onClick={fetchStudents}>
              Thử lại
            </button>
          </div>
        )}

        {/* KHÔNG CÓ SINH VIÊN */}
        {!loading &&
          !error &&
          students.length === 0 && (
            <p
              style={{
                textAlign: "center",
              }}
            >
              Chưa có sinh viên nào
            </p>
          )}

        {/* DANH SÁCH */}
        {!loading &&
          !error &&
          students.map((student) => (
            <div
              key={student._id}
              style={{
                background: "#2c2f3a",
                padding: "20px",
                marginTop: "15px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >

              {/* MSSV */}
              <p
                style={{
                  fontSize: "20px",
                  margin: "8px",
                }}
              >
                <strong>MSSV:</strong>{" "}
                {student.studentId}
              </p>

              {/* HỌ TÊN */}
              <p
                style={{
                  fontSize: "20px",
                  margin: "8px",
                }}
              >
                <strong>Họ tên:</strong>{" "}
                {student.name}
              </p>

              {/* EMAIL */}
              <p
                style={{
                  fontSize: "20px",
                  margin: "8px",
                }}
              >
                <strong>Email:</strong>{" "}
                {student.email}
              </p>

              {/* NÚT SỬA */}
              <button
                onClick={() =>
                  editStudent(student)
                }
                style={{
                  marginRight: "10px",
                  padding: "8px 15px",
                  cursor: "pointer",
                }}
              >
                Sửa
              </button>

              {/* NÚT XÓA */}
              <button
                onClick={() =>
                  deleteStudent(student._id)
                }
                style={{
                  padding: "8px 15px",
                  cursor: "pointer",
                }}
              >
                Xóa
              </button>

            </div>
          ))}
      </div>
    </div>
  );
}

export default App;