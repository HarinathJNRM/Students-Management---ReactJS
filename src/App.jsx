import React, { useState, useEffect } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function App() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated loading
  useEffect(() => {
    setTimeout(() => {
      setStudents([
        { id: 1, name: "Harinath", email: "hari@gmail.com", age: 21 },
        { id: 2, name: "Santhosh", email: "san@gmail.com", age: 29 }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  // Email validation
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Add or Update student
  const handleSubmit = () => {

    if (!name || !email || !age) {
      alert("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      alert("Enter valid email");
      return;
    }

    if (editId) {

      const updated = students.map((student) =>
        student.id === editId
          ? { ...student, name, email, age }
          : student
      );

      setStudents(updated);
      setEditId(null);

    } else {

      const newStudent = {
        id: Date.now(),
        name,
        email,
        age
      };

      setStudents([...students, newStudent]);
    }

    setName("");
    setEmail("");
    setAge("");
  };

  // Delete student
  const deleteStudent = (id) => {

    if (window.confirm("Are you sure you want to delete this student?")) {

      const updatedStudents = students.filter(
        (student) => student.id !== id
      );

      setStudents(updatedStudents);
    }
  };

  // Edit student
  const editStudent = (student) => {

    setEditId(student.id);
    setName(student.name);
    setEmail(student.email);
    setAge(student.age);
  };

  // Download Excel
  const downloadExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(data, "students.xlsx");
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading students...</h2>;
  }

  return (
    <div className="container">

      <h2>Students Management</h2>

      <div className="form">

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update Student" : "Add Student"}
        </button>

        <button className="excelBtn" onClick={downloadExcel}>
          Download Excel
        </button>

      </div>

      <table>

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id}>

              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>

              <td>

                <button
                  className="editBtn"
                  onClick={() => editStudent(student)}
                >
                  Edit
                </button>

                <button
                  className="deleteBtn"
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;