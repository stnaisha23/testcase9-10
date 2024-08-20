import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/employees";

const DataTable = () => {
    const [employees, setEmployees] = useState([]);
    const [originalEmployees, setOriginalEmployees] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        axios.get(API_URL)
            .then((response) => {
                if (response.data && response.data.data) {
                    setEmployees(response.data.data);
                    setOriginalEmployees(response.data.data);
                } else {
                    console.error("Unexpected response format:", response);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error.response?.data || error.message);
            });
    }, []);

    useEffect(() => {
        const autosaveInterval = setInterval(() => {
            if (isDirty) {
                handleBulkSave();
            }
        }, 60000);

        return () => clearInterval(autosaveInterval);
    }, [isDirty, employees]);

    const handleInputChange = (index, key, value) => {
        const updatedEmployees = [...employees];
        updatedEmployees[index][key] = value;
        setEmployees(updatedEmployees);
        setIsDirty(true);
    };

    const handleAddRow = () => {
        setEmployees([...employees, { id: null, name: "", position: "", salary: "" }]);
        setIsDirty(true);
    };

    const handleBulkSave = () => {
        const validEmployees = employees.filter(emp => emp.name && emp.position && emp.salary);
    
        const newEmployees = validEmployees.filter(emp => !emp.id);
        const updatedEmployees = validEmployees.filter(emp => emp.id);
    
        const postData = newEmployees.map(employee => ({
            name: employee.name,
            position: employee.position,
            salary: employee.salary
        }));
    
        if (postData.length > 0) {
            axios.post(API_URL, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setSuccessMessage("Berhasil menambahkan data employee!");
                const addedEmployees = response.data.data;
                const updatedEmployeeList = employees.map(emp => {
                    const addedEmployee = addedEmployees.find(ae => ae.name === emp.name && ae.position === emp.position && ae.salary === emp.salary);
                    return addedEmployee ? { ...emp, id: addedEmployee.id } : emp;
                });
                setEmployees(updatedEmployeeList);
            }).catch((error) => {
                console.error("Error adding new employees:", error.response?.data || error.message);
                alert("An error occurred while adding new employees: " + (error.response?.data?.message || error.message));
            });
        }
    
        const putData = updatedEmployees.map(employee => ({
            id: employee.id,
            name: employee.name,
            position: employee.position,
            salary: employee.salary
        }));
    
        if (putData.length > 0) {
            axios.put(`${API_URL}/update`, putData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                setSuccessMessage("Berhasil memperbarui data employee!");
                setIsDirty(false);
            }).catch((error) => {
                console.error("Error updating employees:", error.response?.data || error.message);
                alert("An error occurred while updating employees: " + (error.response?.data?.message || error.message));
            });
        }
    };

    const handleDeleteRows = () => {
        const selectedIds = employees
            .filter(employee => employee.selected)
            .map(employee => employee.id);

        if (selectedIds.length === 0) {
            alert("Please select employees to delete.");
            return;
        }
        axios.delete(`${API_URL}/delete`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: selectedIds
        })
        .then(() => {
            const remainingEmployees = employees.filter(employee => !employee.selected);
            setEmployees(remainingEmployees);
            setSuccessMessage("Employee yang dipilih berhasil dihapus!");
        })
        .catch((error) => {
            console.error("Error deleting employees:", error.response?.data || error.message);
            alert("An error occurred while deleting employees: " + (error.response?.data?.message || error.message));
        });
    };

    return (
        <div className="p-4">
            {successMessage && <div className="bg-green-500 text-white p-2 mb-4 rounded">{successMessage}</div>}
            <div className="flex justify-end mb-4 space-x-4">
                <button onClick={handleBulkSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                <button onClick={handleDeleteRows} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                <button onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-2 rounded">Add Row</button>
            </div>
            <table className="table-auto w-full text-left bg-white rounded shadow-lg">
                <thead>
                    <tr>
                        <th className="p-2 border-b"><input type="checkbox" /></th>
                        <th className="p-2 border-b">EMPLOYEE ID</th>
                        <th className="p-2 border-b">EMPLOYEE NAME</th>
                        <th className="p-2 border-b">POSITION</th>
                        <th className="p-2 border-b">SALARY</th>
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
                                    setIsDirty(true);
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
