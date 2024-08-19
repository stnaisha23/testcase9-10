package com.sitinuraisha.testcase9.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sitinuraisha.testcase9.models.Employee;
import com.sitinuraisha.testcase9.repositories.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public List<Employee> addMultipleEmployees(List<Employee> employees) {
        return employeeRepository.saveAll(employees);
    }

    public Optional<Employee> updateEmployee(Long id, Employee employeeRequest) {
        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();
            employee.setName(employeeRequest.getName());
            employee.setPosition(employeeRequest.getPosition());
            employee.setSalary(employeeRequest.getSalary());
            return Optional.of(employeeRepository.save(employee));
        } else {
            return Optional.empty();
        }
    }

    public List<Employee> updateMultipleEmployees(List<Employee> employeeRequests) {
        for (Employee employeeRequest : employeeRequests) {
            Optional<Employee> employeeOpt = employeeRepository.findById(employeeRequest.getId());
            if (employeeOpt.isPresent()) {
                Employee employee = employeeOpt.get();
                employee.setName(employeeRequest.getName());
                employee.setPosition(employeeRequest.getPosition());
                employee.setSalary(employeeRequest.getSalary());
                employeeRepository.save(employee);
            }
        }
        return employeeRepository.saveAll(employeeRequests);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public void deleteMultipleEmployees(List<Long> ids) {
        employeeRepository.deleteAllById(ids);
    }
}
