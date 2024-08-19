import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/employees";

const DataTable = () => {
    const [employees, setEmployees] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        // Fetch initial data
        axios.get(API_URL).then((response) => setEmployees(response.data));
    }, []);

    const handleInputChange = (index, key, value) => {
        const updatedEmployees = [...employees];
        updatedEmployees[index][key] = value;
        setEmployees(updatedEmployees);
    };

    const handleSave = (employee) => {
        axios.put(`${API_URL}/${employee.id}`, employee)
            .then(() => setSuccessMessage("Data saved successfully!"));
    };

    const handleAddRow = () => {
        setEmployees([...employees, { id: "", name: "", position: "", salary: "" }]);
    };

    const handleDeleteRows = () => {
        const remainingEmployees = employees.filter((employee) => !employee.selected);
        setEmployees(remainingEmployees);
        // Implement API call for deletion if required
    };

    const handleBulkSave = () => {
        axios.put(API_URL, employees).then(() => setSuccessMessage("All changes saved successfully!"));
    };

    return (
        <div className="p-4">
            {successMessage && <div className="bg-green-500 text-white p-2 mb-4 rounded">{successMessage}</div>}
            <div className="flex justify-between mb-4">
                <button onClick={handleBulkSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                <button onClick={handleDeleteRows} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
            <table className="table-auto w-full text-left bg-white rounded shadow-lg">
                <thead>
                    <tr>
                        <th className="p-2 border-b"><input type="checkbox" /></th>
                        <th className="p-2 border-b">EMPLOYEE ID</th>
                        <th className="p-2 border-b">EMPLOYEE NAME</th>
                        <th className="p-2 border-b">POSITION</th>
                        <th className="p-2 border-b">SALARY</th>
                        <th className="p-2 border-b"></th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td className="p-2 border-b">
                                <input type="checkbox" onChange={() => {
                                    const updatedEmployees = [...employees];
                                    updatedEmployees[index].selected = !updatedEmployees[index].selected;
                                    setEmployees(updatedEmployees);
                                }} />
                            </td>
                            <td className="p-2 border-b">{employee.id || index + 1}</td>
                            <td className="p-2 border-b">
                                <input
                                    type="text"
                                    value={employee.name || ""}
                                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                    placeholder="Insert Employee Name"
                                    className="w-full border rounded px-2 py-1"
                                />
                            </td>
                            <td className="p-2 border-b">
                                <input
                                    type="text"
                                    value={employee.position || ""}
                                    onChange={(e) => handleInputChange(index, "position", e.target.value)}
                                    placeholder="Insert Position"
                                    className="w-full border rounded px-2 py-1"
                                />
                            </td>
                            <td className="p-2 border-b">
                                <input
                                    type="number"
                                    value={employee.salary || ""}
                                    onChange={(e) => handleInputChange(index, "salary", e.target.value)}
                                    placeholder="Insert Salary"
                                    className="w-full border rounded px-2 py-1"
                                />
                            </td>
                            <td className="p-2 border-b">
                                <button
                                    onClick={handleAddRow}
                                    className="bg-blue-500 text-white rounded-full p-2"
                                >
                                    <span className="material-icons">add</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
