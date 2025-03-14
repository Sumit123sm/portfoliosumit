CREATE DATABASE portfolioself;

USE portfolioself;

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(255),
    image_url VARCHAR(255),
    project_link VARCHAR(255)
);

INSERT INTO projects (title, description, technologies, image_url, project_link) VALUES
('Sales Analysis', 'Analyzed sales data using SQL and Excel.', 'SQL, Excel', 'images/sales.png', 'https://github.com/yourusername/sales-analysis'),
('Customer Segmentation', 'Used Machine Learning for customer segmentation.', 'Python, ML', 'images/segmentation.png', 'https://github.com/yourusername/customer-segmentation');

CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL
);

INSERT INTO skills (name, level) VALUES
('SQL', 'Advanced'),
('Python', 'Intermediate'),
('Excel', 'Advanced'),
('Power BI', 'Beginner');
