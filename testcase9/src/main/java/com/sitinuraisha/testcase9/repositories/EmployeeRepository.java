package com.sitinuraisha.testcase9.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sitinuraisha.testcase9.models.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}
