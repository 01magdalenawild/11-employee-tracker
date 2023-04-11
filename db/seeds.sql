USE employee_tracker_db;
INSERT INTO department(department_name) VALUES ('hr'),('sales'),('management');
INSERT INTO role(title,salary,department_id) VALUES ('human resources manager',50000,1),
('sales person',20000,2),('vp',65000,3);
INSERT INTO employee(first_name, last_name,role_id,manager_id)VALUES('corey','yates',3,NULL),('magdala','wild',2,1),('monica','lee',1,1);