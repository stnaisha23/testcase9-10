package com.sitinuraisha.testcase9.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sitinuraisha.testcase9.DTO.request.EmployeeRequestDTO;
import com.sitinuraisha.testcase9.DTO.response.EmployeeResponseDTO;
import com.sitinuraisha.testcase9.models.Employee;
import com.sitinuraisha.testcase9.services.EmployeeService;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<EmployeeResponseDTO> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        EmployeeResponseDTO response = new EmployeeResponseDTO();
        if (employees.isEmpty()) {
            response.setMessage("Data Employee Tidak Tersedia!");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else {
            response.setMessage("Berhasil menampilkan semua data employee!");
            response.setData(employees);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        EmployeeResponseDTO response = new EmployeeResponseDTO();
        if (employee.isPresent()) {
            response.setMessage("Berhasil menampilkan data employee untuk ID " + id);
            response.setData(employee.get());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.setMessage("Data employee dengan ID " + id + " tidak ditemukan");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> addEmployees(@RequestBody List<EmployeeRequestDTO> employeeRequestsDTO) {
        List<Employee> employees = convertToEmployeeList(employeeRequestsDTO);
        List<Employee> savedEmployees = employeeService.addMultipleEmployees(employees);
        EmployeeResponseDTO response = new EmployeeResponseDTO();
        if (savedEmployees.isEmpty()) {
            response.setMessage("Gagal menambahkan data employee!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            response.setMessage("Berhasil menambahkan data employee!");
            response.setData(savedEmployees);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EmployeeResponseDTO> updateEmployee(@PathVariable Long id, @RequestBody EmployeeRequestDTO employeeRequestDTO) {
        Employee employee = convertToEmployee(employeeRequestDTO);
        Optional<Employee> updatedEmployee = employeeService.updateEmployee(id, employee);
        EmployeeResponseDTO response = new EmployeeResponseDTO();
        if (updatedEmployee.isPresent()) {
            response.setMessage("Berhasil memperbarui data employee!");
            response.setData(updatedEmployee.get());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.setMessage("Data dengan ID " + id + " tidak ditemukan");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<EmployeeResponseDTO> updateMultipleEmployees(@RequestBody List<EmployeeRequestDTO> employeeRequests) {
        List<Employee> employees = convertToEmployeeList(employeeRequests);
        List<Employee> updatedEmployees = employeeService.updateMultipleEmployees(employees);
        EmployeeResponseDTO response = new EmployeeResponseDTO();
        if (updatedEmployees.isEmpty()) {
            response.setMessage("Gagal memperbarui data employee!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            response.setMessage("Berhasil memperbarui data employee!");
            response.setData(updatedEmployees);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<EmployeeResponseDTO> deleteEmployee(@PathVariable Long id) {
        EmployeeResponseDTO response = new EmployeeResponseDTO();
        try {
            employeeService.deleteEmployee(id);
            response.setMessage("Berhasil menghapus data employee!");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMessage("Gagal menghapus data employee!");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<EmployeeResponseDTO> deleteMultipleEmployees(@RequestBody List<Long> ids) {
        EmployeeResponseDTO response = new EmployeeResponseDTO();
        try {
            employeeService.deleteMultipleEmployees(ids);
            response.setMessage("Berhasil menghapus data employee!");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMessage("Gagal menghapus data employee!");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Employee convertToEmployee(EmployeeRequestDTO request) {
        Employee employee = new Employee();
        employee.setId(request.getId());
        employee.setName(request.getName());
        employee.setPosition(request.getPosition());
        employee.setSalary(request.getSalary());
        return employee;
    }

    private List<Employee> convertToEmployeeList(List<EmployeeRequestDTO> requests) {
        return requests.stream().map(this::convertToEmployee).toList();
    }
}
