// for reference : https://www.w3schools.com/nodejs/nodejs_mysql_create_table.asp 
// https://github.com/mysqljs/mysql
// https://www.geeksforgeeks.org/how-to-create-table-in-sqlite3-database-using-node-js/?ref=gcse_outind (BEST ONE)
/*<?php
$database_host = "dbhost.cs.man.ac.uk";
$database_user = "z26101hh";
$database_pass = "UTZxLV/au62nauNC7XxBhNsvh5Wm7CcShrtKz4bwj24";
$database_name = "tellmewhen";
?>*/
import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'dbhost.cs.man.ac.uk', 
    user: 'z26101hh', 
    password: 'UTZxLV/au62nauNC7XxBhNsvh5Wm7CcShrtKz4bwj24',
    database: 'tellmewhen' 
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database.');

  // Create tables
  const createTables = [
    `
    CREATE TABLE IF NOT EXISTS BUSINESS_TABLE (
        Business_ID INT AUTO_INCREMENT PRIMARY KEY,
        Business_Name VARCHAR(255)
        Business_Photo TEXT
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS WORKER_TABLE (
        Worker_ID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(255) NOT NULL,
        Business_ID INT,
        Privilege_level INT,
        Hashed_Password VARCHAR(255) NOT NULL,
        FOREIGN KEY (Business_ID) REFERENCES BUSINESS_TABLE(Business_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS JOB_TABLE (
        Job_ID INT AUTO_INCREMENT PRIMARY KEY,
        Description TEXT NOT NULL,
        URL TEXT NOT NULL,
        Due_Date DATETIME
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS CURRENT_JOB (
        User_ID INT,
        Job_ID INT,
        PRIMARY KEY (User_ID, Job_ID),
        FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID),
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS JOB_HISTORY (
        History_ID INT AUTO_INCREMENT PRIMARY KEY,
        User_ID INT,
        Job_ID INT,
        Completion_Date DATETIME,
        Remarks TEXT,
        FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID),
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS CHAT_MESSAGES (
        Message_ID INT AUTO_INCREMENT PRIMARY KEY,
        User_ID INT,
        Job_ID INT,
        Message_Content TEXT NOT NULL,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        Is_Read BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID),
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
        Notification_ID INT AUTO_INCREMENT PRIMARY KEY,
        User_ID INT,
        Job_ID INT,
        Notification_Content TEXT NOT NULL,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        Is_Read BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID),
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS SUBSCRIPTION_TABLE (
        Subscription_ID INT AUTO_INCREMENT PRIMARY KEY,
        Endpoint TEXT NOT NULL,
        Auth_Key1 TEXT NOT NULL,
        Auth_Key2 TEXT NOT NULL,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS ACCESS_TOKENS (
    Token_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Access_Token VARCHAR(255) NOT NULL,
    Expiration_Time DATETIME NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID)
    )
    `,
  ];

  // Execute each table creation query
  createTables.forEach((query) => {
    db.query(query, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Table created or already exists.');
      }
    });
  });

  // Close the database connection
  db.end((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});
