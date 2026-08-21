import { useEffect, useState } from "react";

function App() {
    const [students, setStudents] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

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

            setStudentId("");
            setName("");
            setEmail("");

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
                        onChange={(e) => setStudentId(e.target.value)}
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
                        onChange={(e) => setName(e.target.value)}
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
                        onChange={(e) => setEmail(e.target.value)}
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
                        <li key={student._id}>
                            {student.studentId} - {student.name} - {student.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
