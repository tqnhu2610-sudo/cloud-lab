import { useCallback, useEffect, useState } from "react";

import "./App.css";



// Khi chạy trên Render, dùng URL backend đã triển khai.

// Khi chạy ở máy tính, nếu backend chạy cổng 5000, dùng localhost.

const API_BASE = (

  import.meta.env.VITE_API_URL ||

  "https://mern-backend-235349.onrender.com"

).replace(/\/+$/, "");



const STUDENTS_API = `${API_BASE}/api/students`;



function App() {

  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [notice, setNotice] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);



  const getStudents = useCallback(async () => {

    try {

      setLoading(true);

      setError("");



      const response = await fetch(STUDENTS_API);



      if (!response.ok) {

        throw new Error(`Máy chủ trả về lỗi ${response.status}`);

      }



      const data = await response.json();



      if (!Array.isArray(data)) {

        throw new Error("Dữ liệu sinh viên không hợp lệ.");

      }



      setStudents(data);

    } catch (err) {

      console.error("Lỗi lấy danh sách:", err);

      setError("Không kết nối được Backend. Vui lòng thử lại.");

    } finally {

      setLoading(false);

    }

  }, []);



  useEffect(() => {

    getStudents();

  }, [getStudents]);



  const showNotice = (type, message) => {

    setNotice({ type, message });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();



    if (!studentId.trim() || !name.trim() || !email.trim()) {

      showNotice("error", "Vui lòng nhập đầy đủ thông tin sinh viên.");

      return;

    }



    try {

      setSubmitting(true);



      const wasEditing = Boolean(editingId);
      const response = await fetch(
        editingId ? `${STUDENTS_API}/${editingId}` : STUDENTS_API,
        {
        method: editingId ? "PUT" : "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          studentId: studentId.trim(),

          name: name.trim(),

          email: email.trim(),

        }),

      });



      const data = await response.json();



      if (!response.ok) {

        throw new Error(data.message || "Thêm sinh viên thất bại.");

      }



      resetForm();
      showNotice("success", wasEditing ? "Cập nhật sinh viên thành công!" : "Thêm sinh viên thành công!");

      await getStudents();

    } catch (err) {

      console.error("Lỗi thêm sinh viên:", err);

      showNotice("error", err.message || "Không kết nối được Backend.");

    } finally {

      setSubmitting(false);

    }

  };



  const resetForm = () => {
    setStudentId("");
    setName("");
    setEmail("");
    setEditingId(null);
    setNotice(null);
  };

  const handleUpdate = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId || "");
    setName(student.name || "");
    setEmail(student.email || "");
    setNotice({ type: "success", message: `Đang chỉnh sửa thông tin sinh viên ${student.studentId || ""}.` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`${STUDENTS_API}/${studentToDelete._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Xóa sinh viên thất bại.");
      }
      if (editingId === studentToDelete._id) resetForm();
      setStudentToDelete(null);
      showNotice("success", "Xóa sinh viên thành công!");
      await getStudents();
    } catch (err) {
      console.error("Lỗi xóa:", err);
      showNotice("error", err.message || "Không kết nối được Backend.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredStudents = students.filter((student) => {

    const keyword = search.trim().toLowerCase();



    return (

      (student.studentId || "").toLowerCase().includes(keyword) ||

      (student.name || "").toLowerCase().includes(keyword) ||

      (student.email || "").toLowerCase().includes(keyword)

    );

  });



  return (

    <div className="app-shell">

      <header className="topbar">

        <a className="brand" href="#">

          <span className="brand-icon">SV</span>

          <span>

            <strong>StudentHub</strong>

            <small>STUDENT MANAGEMENT SYSTEM</small>

          </span>

        </a>



        <div className="cloud-status">

          <span className="status-dot" />

          Hệ thống quản lý sinh viên

        </div>

      </header>



      <section className="hero">

        <div className="hero-copy">

          <span className="eyebrow">QUẢN LÝ DỮ LIỆU SINH VIÊN</span>

          <h1>Quản lý sinh viên</h1>

          <p>

            Quản lý thông tin sinh viên nhanh chóng, đơn giản

            và thuận tiện.

          </p>

        </div>



        <div className="hero-mark">🎓</div>

      </section>



      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon purple">♙</div>

          <div>

            <p>Tổng số sinh viên</p>

            <strong>{students.length}</strong>

          </div>

        </div>



        <div className="stat-card">

          <div className="stat-icon green">✓</div>

          <div>

            <p>Trạng thái hệ thống</p>

            <strong className="online-text">

              {error ? "Chưa kết nối" : loading ? "Đang tải..." : "Đang hoạt động"}

            </strong>

          </div>

        </div>

      </section>



      {notice && (

        <div className={`notice ${notice.type}`}>

          <span>{notice.type === "success" ? "✓" : "!"}</span>

          {notice.message}

          <button

            type="button"

            aria-label="Đóng thông báo"

            onClick={() => setNotice(null)}

          >

            ×

          </button>

        </div>

      )}



      <main className="content-grid">

        <section className="panel form-panel">

          <div className="panel-heading">

            <div className="heading-icon">＋</div>

            <div>

              <h2>{editingId ? "Chỉnh sửa thông tin sinh viên" : "Thêm sinh viên"}</h2>

              <p>{editingId ? "Cập nhật thông tin sinh viên rồi nhấn Lưu thay đổi." : "Nhập thông tin để thêm sinh viên mới vào hệ thống."}</p>

            </div>

          </div>



          <form className="student-form" onSubmit={handleSubmit}>

            <label htmlFor="studentId">

              Mã số sinh viên <span>\*</span>

            </label>

            <input

              id="studentId"

              value={studentId}

              onChange={(e) => setStudentId(e.target.value)}

              placeholder="Ví dụ: 22123456"

              required

            />



            <label htmlFor="studentName">

              Họ và tên <span>\*</span>

            </label>

            <input

              id="studentName"

              value={name}

              onChange={(e) => setName(e.target.value)}

              placeholder="Nhập họ và tên"

              required

            />



            <label htmlFor="studentEmail">

              Địa chỉ email <span>\*</span>

            </label>

            <input

              id="studentEmail"

              type="email"

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              placeholder="example@email.com"

              required

            />



            <button

              className="primary-button"

              type="submit"

              disabled={submitting}

            >

              {submitting ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "+  Thêm sinh viên"}

            </button>



            <button

              className="secondary-button"

              type="button"

              onClick={() => {

                setStudentId("");

                setName("");

                setEmail("");

                setNotice(null);

              }}

            >

              Làm mới biểu mẫu

            </button>



            <p className="required-note">

              <span>\*</span> Các trường thông tin là bắt buộc.

            </p>

          </form>

        </section>



        <section className="panel list-panel">

          <div className="list-heading">

            <div>

              <h2>Danh sách sinh viên</h2>

              <p>Thông tin sinh viên được lưu trong cơ sở dữ liệu.</p>

            </div>



            <span className="count-badge">

              {filteredStudents.length} sinh viên

            </span>

          </div>



          <div className="toolbar">

            <div className="search-box">

              <span>⌕</span>

              <input

                value={search}

                onChange={(e) => setSearch(e.target.value)}

                placeholder="Tìm theo MSSV, họ tên hoặc email..."

                aria-label="Tìm kiếm sinh viên"

              />

            </div>



            <button

              className="refresh-button"

              type="button"

              onClick={getStudents}

            >

              ↻ Làm mới

            </button>

          </div>



          {loading ? (

            <div className="empty-state">

              <div className="loading-spinner" />

              <strong>Đang tải dữ liệu</strong>

              <p>Vui lòng chờ trong giây lát.</p>

            </div>

          ) : error ? (

            <div className="error-box">

              <strong>Không thể tải danh sách sinh viên</strong>

              <p>{error}</p>

              <button type="button" onClick={getStudents}>

                Thử kết nối lại

              </button>

            </div>

          ) : filteredStudents.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">♙</div>

              <strong>

                {search ? "Không tìm thấy sinh viên" : "Chưa có sinh viên"}

              </strong>

              <p>

                {search

                  ? "Thử tìm bằng từ khóa khác."

                  : "Thêm sinh viên bằng biểu mẫu để hiển thị dữ liệu tại đây."}

              </p>

            </div>

          ) : (

            <div className="table-wrap">

              <table className="student-table">

                <thead>

                  <tr>

                    <th>MSSV</th>

                    <th>Họ và tên</th>

                    <th>Email</th>

                    <th className="actions-heading">Thao tác</th>

                  </tr>

                </thead>



                <tbody>

                  {filteredStudents.map((student) => (

                    <tr key={student._id}>

                      <td>

                        <span className="student-id">

                          {student.studentId || "N/A"}

                        </span>

                      </td>



                      <td>

                        <div className="student-name-cell">

                          <span className="avatar">

                            {(student.name || "?").charAt(0).toUpperCase()}

                          </span>

                          <strong>{student.name || "Chưa có tên"}</strong>

                        </div>

                      </td>



                      <td className="email-cell">

                        {student.email || "Chưa có email"}

                      </td>



                      <td>

                        <div className="table-actions">

                          <button

                            className="edit-button"

                            type="button"

                            onClick={() => handleUpdate(student)}

                          >

                            ✎ <span>Sửa</span>

                          </button>



                          <button

                            className="delete-button"

                            type="button"

                            onClick={() => handleDelete(student)}

                          >

                            × <span>Xóa</span>

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}



          <div className="list-footer">

            <span>Quản lý thông tin sinh viên</span>

            <span>

              <span className="status-dot" />

              Dữ liệu từ Backend

            </span>

          </div>

        </section>

      </main>



      {studentToDelete && (
        <div
          role="presentation"
          onClick={() => !deleting && setStudentToDelete(null)}
          style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(15, 23, 42, 0.58)", backdropFilter: "blur(4px)" }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "440px", padding: "28px", borderRadius: "20px", background: "#ffffff", color: "#1e293b", boxShadow: "0 24px 80px rgba(15, 23, 42, 0.28)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div style={{ width: "48px", height: "48px", flexShrink: 0, display: "grid", placeItems: "center", borderRadius: "14px", background: "#fee2e2", color: "#dc2626", fontSize: "25px", fontWeight: 700 }}>!</div>
              <div>
                <h2 id="delete-dialog-title" style={{ margin: 0, fontSize: "20px" }}>Xác nhận xóa sinh viên</h2>
                <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: "13px" }}>Thao tác này sẽ xóa dữ liệu khỏi hệ thống.</p>
              </div>
            </div>
            <p style={{ lineHeight: 1.65, margin: "0 0 24px", color: "#475569" }}>
              Bạn có chắc chắn muốn xóa sinh viên <strong style={{ color: "#0f172a" }}>{studentToDelete.name || "Chưa có tên"}</strong>
              {studentToDelete.studentId ? <> (MSSV: <strong style={{ color: "#0f172a" }}>{studentToDelete.studentId}</strong>)</> : null}?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
              <button type="button" disabled={deleting} onClick={() => setStudentToDelete(null)} style={{ padding: "11px 17px", border: "1px solid #cbd5e1", borderRadius: "10px", background: "#fff", color: "#334155", fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer" }}>Hủy</button>
              <button type="button" disabled={deleting} onClick={confirmDelete} style={{ padding: "11px 17px", border: "none", borderRadius: "10px", background: "#dc2626", color: "#fff", fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1 }}>{deleting ? "Đang xóa..." : "Xóa sinh viên"}</button>
            </div>
          </section>
        </div>
      )}

      <footer className="footer">

        <span>StudentHub · Hệ thống quản lý sinh viên</span>

        <span>React · Node.js · MongoDB</span>

      </footer>

    </div>

  );

}



export default App;
