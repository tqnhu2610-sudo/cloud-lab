import { useEffect, useState } from "react";

function App() {
    // ==============================
    // DANH SACH SINH VIEN
    // ==============================
    const [students, setStudents] = useState([]);

    // ==============================
    // DU LIEU FORM
    // ==============================
    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // ==============================
    // TRANG THAI
    // ==============================
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==============================
    // DIA CHI BACKEND
    // ==============================
    const API_URL = "http://localhost:5000/api/students";

    // ==============================
    // LAY DANH SACH SINH VIEN
    // ==============================
    const getStudents = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    `Khong the lay danh sach sinh vien. Ma loi: ${response.status}`
                );
            }

            const data = await response.json();

            console.log("Danh sach sinh vien:", data);

            if (Array.isArray(data)) {
                setStudents(data);
            } else {
                setStudents([]);
                console.error("Du lieu Backend khong phai mang:", data);
            }

        } catch (error) {
            console.error("Loi lay danh sach:", error);

            setError("Khong ket noi duoc Backend!");

            setStudents([]);

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // KHI MO TRANG
    // ==============================
    useEffect(() => {
        getStudents();
    }, []);

    // ==============================
    // THEM SINH VIEN
    // ==============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    studentId: studentId.trim(),
                    name: name.trim(),
                    email: email.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Them sinh vien that bai!");
                return;
            }

            alert("Them sinh vien thanh cong!");

            // XOA FORM
            setStudentId("");
            setName("");
            setEmail("");

            // TAI LAI DANH SACH
            getStudents();

        } catch (error) {
            console.error("Loi them sinh vien:", error);

            alert("Khong ket noi duoc Backend!");
        }
    };

    // ==============================
    // CAP NHAT SINH VIEN
    // ==============================
    const handleUpdate = async (student) => {

        const newStudentId = prompt(
            "Nhap MSSV moi:",
            student.studentId || ""
        );

        if (newStudentId === null) {
            return;
        }

        const newName = prompt(
            "Nhap ho ten moi:",
            student.name || ""
        );

        if (newName === null) {
            return;
        }

        const newEmail = prompt(
            "Nhap email moi:",
            student.email || ""
        );

        if (newEmail === null) {
            return;
        }

        // KIEM TRA DU LIEU
        if (
            !newStudentId.trim() ||
            !newName.trim() ||
            !newEmail.trim()
        ) {
            alert("Vui long nhap day du thong tin!");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/${student._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        studentId: newStudentId.trim(),
                        name: newName.trim(),
                        email: newEmail.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Cap nhat sinh vien that bai!");
                return;
            }

            alert("Cap nhat sinh vien thanh cong!");

            // TAI LAI DANH SACH
            getStudents();

        } catch (error) {
            console.error("Loi cap nhat:", error);

            alert("Khong ket noi duoc Backend!");
        }
    };

    // ==============================
    // XOA SINH VIEN
    // ==============================
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Ban co chac chan muon xoa sinh vien nay?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Xoa sinh vien that bai!");
                return;
            }

            alert("Xoa sinh vien thanh cong!");

            // TAI LAI DANH SACH
            getStudents();

        } catch (error) {
            console.error("Loi xoa:", error);

            alert("Khong ket noi duoc Backend!");
        }
    };

    // ==============================
    // GIAO DIEN
    // ==============================
    return (
        <div
            style={{
                textAlign: "center",
                padding: "30px"
            }}
        >
            <h1>Quan ly sinh vien</h1>

            {/* ========================= */}
            {/* FORM THEM SINH VIEN */}
            {/* ========================= */}

            <h2>Them sinh vien</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>MSSV: </label>

                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) =>
                            setStudentId(e.target.value)
                        }
                        placeholder="Nhap MSSV"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Ho ten: </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Nhap ho ten"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Email: </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Nhap email"
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Them sinh vien
                </button>

            </form>

            {/* ========================= */}
            {/* DANH SACH SINH VIEN */}
            {/* ========================= */}

            <h2>Danh sach sinh vien</h2>

            {loading ? (

                <p>Dang tai danh sach sinh vien...</p>

            ) : error ? (

                <div>
                    <p>{error}</p>

                    <button onClick={getStudents}>
                        Thu lai
                    </button>
                </div>

            ) : students.length === 0 ? (

                <p>Chua co sinh vien</p>

            ) : (

                <ul
                    style={{
                        display: "inline-block",
                        textAlign: "left"
                    }}
                >
                    {students.map((student) => (

                        <li
                            key={student._id}
                            style={{
                                marginBottom: "15px"
                            }}
                        >
                            <strong>
                                {student.studentId || "Khong co MSSV"}
                            </strong>

                            {" - "}

                            {student.name || "Khong co ten"}

                            {" - "}

                            {student.email || "Khong co email"}

                            {/* NUT SUA */}

                            <button
                                onClick={() =>
                                    handleUpdate(student)
                                }
                                style={{
                                    marginLeft: "10px"
                                }}
                            >
                                Sua
                            </button>

                            {/* NUT XOA */}

                            <button
                                onClick={() =>
                                    handleDelete(student._id)
                                }
                                style={{
                                    marginLeft: "10px"
                                }}
                            >
                                Xoa
                            </button>

                        </li>

                    ))}
                </ul>

            )}

        </div>
    );
}

export default App;