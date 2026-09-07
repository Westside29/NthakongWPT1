import { useEffect, useState } from "react";
import './App.css'
const API_URL = "http://localhost:5000/api/students";

const emptyForm = {
  studentNumber: "",
  studentName: "",
  status: "Present"
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingNumber, setEditingNumber] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Could not retrieve students.");
      setStudents(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!form.studentNumber || !form.studentName || !form.status) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const isEditing = editingNumber !== null;
      const url = isEditing
        ? `${API_URL}/${editingNumber}`
        : API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentNumber: Number(form.studentNumber),
          studentName: form.studentName.trim(),
          status: form.status
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Operation failed.");

      setMessage(isEditing ? "Student updated successfully." : "Student inserted successfully.");
      setForm(emptyForm);
      setEditingNumber(null);
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editStudent = (student) => {
    setEditingNumber(student.student_number);
    setForm({
      studentNumber: String(student.student_number),
      studentName: student.student_name,
      status: student.status
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingNumber(null);
    setForm(emptyForm);
    setMessage("");
  };

  return (
    <div className="app">
      <header className="header">
        <div>
        
          <h1>Student Attendance Manager</h1>
          <p className="subtitle">
            Insert, retrieve and update student attendance records.
          </p>
        </div>
      </header>

      <main className="container">
        <section className="card form-card">
          <h2>{editingNumber !== null ? "Update Student" : "Add Student"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Student Number
                <input
                  type="number"
                  name="studentNumber"
                  value={form.studentNumber}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  disabled={editingNumber !== null}
                  min="1"
                />
              </label>

              <label>
                Student Name
                <input
                  type="text"
                  name="studentName"
                  value={form.studentName}
                  onChange={handleChange}
                  placeholder="e.g. Tebogo"
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </label>
            </div>

            <div className="buttons">
              <button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingNumber !== null
                    ? "Update Student"
                    : "Add Student"}
              </button>

              {editingNumber !== null && (
                <button type="button" className="secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              )}

              <button type="button" className="secondary" onClick={loadStudents}>
                Refresh Table
              </button>
            </div>
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="card">
          <div className="table-heading">
            <div>
              <h2>Attendance Records</h2>
              <p>{students.length} student record(s)</p>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student Number</th>
                  <th>Student Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.student_number}>
                      <td>{student.student_number}</td>
                      <td>{student.student_name}</td>
                      <td>
                        <span
                          className={`status ${
                            student.status === "Present" ? "present" : "absent"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => editStudent(student)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer>Student Attendance Manager • React + Express + MySQL</footer>
    </div>
  );
}

export default App;