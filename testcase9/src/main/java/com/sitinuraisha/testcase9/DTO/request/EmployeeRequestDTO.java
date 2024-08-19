package com.sitinuraisha.testcase9.DTO.request;

import lombok.Data;

@Data
public class EmployeeRequestDTO {
    private Long id;
    private String name;
    private String position;
    private Double salary;
}