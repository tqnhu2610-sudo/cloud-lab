import { useEffect, useState } from "react";

function App() {
    // DANH SACH SINH VIEN
    const [students, setStudents] = useState([]);

    // DU LIEU FORM
    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // CAU 59 - LAY DANH SACH SINH VIEN
    const getStudents = () => {
        fetch("/api/students")
            .then((response) => response.json())
            .then((data) => {
                setStudents(data);
            })
            .catch((error) => {
                console.error("Loi:", error);
            });
    };

    useEffect(() => {
        getStudents();
    }, []);

    // CAU 60 - THEM SINH VIEN
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId: studentId,
                    name: name,
                    email: email
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Them sinh vien that bai");
                return;
            }

            alert("Them sinh vien thanh cong!");

            // XOA DU LIEU CU TRONG FORM
            setStudentId("");
            setName("");
            setEmail("");

            // TAI LAI DANH SACH
            getStudents();

        } catch (error) {
            console.error("Loi:", error);
            alert("Khong ket noi duoc Backend");
        }
    };

    // CAU 61 - CAP NHAT SINH VIEN
    const handleUpdate = async (student) => {
        const newStudentId = prompt(
            "Nhap MSSV moi:",
            student.studentId
        );

        const newName = prompt(
            "Nhap ho ten moi:",
            student.name
        );

        const newEmail = prompt(
            "Nhap email moi:",
            student.email
        );

        if (!newStudentId || !newName || !newEmail) {
            alert("Vui long nhap day du thong tin");
            return;
        }

        try {
            const response = await fetch(
                `/api/students/${student._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studentId: newStudentId,
                        name: newName,
                        email: newEmail
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Cap nhat sinh vien that bai");
                return;
            }

            alert("Cap nhat sinh vien thanh cong!");

            // TAI LAI DANH SACH SAU KHI SUA
            getStudents();

        } catch (error) {
            console.error("Loi:", error);
            alert("Khong ket noi duoc Backend");
        }
    };

    // CAU 62 - XOA SINH VIEN
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Ban co chac chan muon xoa sinh vien nay?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `/api/students/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Xoa sinh vien that bai");
                return;
            }

            alert("Xoa sinh vien thanh cong!");

            // TAI LAI DANH SACH SAU KHI XOA
            getStudents();

        } catch (error) {
            console.error("Loi:", error);
            alert("Khong ket noi duoc Backend");
        }
    };

    return (
        <div>
            <h1>Quan ly sinh vien</h1>

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

            <h2>Danh sach sinh vien</h2>

            {students.length === 0 ? (
                <p>Chua co sinh vien</p>
            ) : (
                <ul>
                    {students.map((student) => (
                        <li
                            key={student._id}
                            style={{
                                marginBottom: "10px"
                            }}
                        >
                            <strong>
                                {student.studentId}
                            </strong>

                            {" - "}

                            {student.name}

                            {" - "}

                            {student.email}

                            {/* NUT SUA - CAU 61 */}
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

                            {/* NUT XOA - CAU 62 */}
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