// for reference : https://www.w3schools.com/nodejs/nodejs_mysql_create_table.asp 

const mysql = require('mysql2/promise');

// database connection 
const dbConfig = {
    host: 'localhost', 
    user: 'root',      
    password: '',      
    database: 'tell_me_when'
};

(async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // BUISNESS TABLE
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS BUSINESS_TABLE (
                Business_ID INT AUTO_INCREMENT PRIMARY KEY,
               Business_Name VARCHAR(255)
            )
        `);

        // USER TABLE
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS USER_TABLE (
                User_ID INT AUTO_INCREMENT PRIMARY KEY,
                Username VARCHAR(255) NOT NULL,
                Business_ID INT,
                Hashed_Password VARCHAR(255) NOT NULL,
                FOREIGN KEY (Business_ID) REFERENCES BUSINESS_TABLE(Business_ID)
            )
        `);

        // JOB TABLE
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS JOB_TABLE (
                Job_ID INT AUTO_INCREMENT PRIMARY KEY,
                Description VARCHAR(100) NOT NULL,
                URL VARCHAR(100) NOT NULL,
                Due_Date DATETIME
            )
        `);
        // ASSOCIATIVE CURRENT JOB TABLE
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS CURRENT_JOB (
                User_ID INT,
                Job_ID INT,
                FOREIGN KEY (User_ID) REFERENCES USER_TABLE(User_ID),
                FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID),
                PRIMARY KEY (User_ID, Job_ID)
            )
        `);

        console.log("Tables created successfully!");

        // close connection
        await connection.end();
    } catch (error) {
        console.error("Error creating tables:", error.message);
    }
})();
