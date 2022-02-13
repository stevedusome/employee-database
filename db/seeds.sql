INSERT INTO departments (department_name)
VALUES
  ('Management'),
  ('Quality'),
  ('Production'),
  ('HR'),
  ('Temp Employees');

  INSERT INTO roles (title, salary, department_id)
VALUES
  ('CEO', 500000, 1),
  ('Partner', 350000, 1),
  ('Auditor', 100000, 2),
  ('Inspector', 80000, 2),
  ('Lead Hand', 70000, 3),
  ('Machine Operator', 65000, 3),
  ('HR Director', 80000, 4),
  ('HR Admin', 60000, 4),
  ('Temp', 35000, 5);

  INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, NULL),
  ('Virginia', 'Woolf', 2, NULL),
  ('Piers', 'Gaveston', 3, NULL),
  ('Charles', 'LeRoi', 4, NULL),
  ('Katherine', 'Mansfield', 5, NULL),
  ('Dora', 'Carrington', 6, NULL),
  ('Edward', 'Bellamy', 7, NULL),
  ('Montague', 'Summers', 8, NULL),
  ('Octavia', 'Butler', 9, NULL),
  ('Unica', 'Zurn', 9, NULL);