// for reference : https://www.w3schools.com/nodejs/nodejs_mysql_create_table.asp 
// https://github.com/mysqljs/mysql
// https://www.geeksforgeeks.org/how-to-create-table-in-sqlite3-database-using-node-js/?ref=gcse_outind (BEST ONE)

import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('tellmewhen.db');

// create tables helper function
const createTables = [
    `
    CREATE TABLE IF NOT EXISTS BUSINESS_TABLE (
        Business_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Business_Name TEXT
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS USER_TABLE (
        User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Username TEXT NOT NULL,
        Business_ID INTEGER,
        Hashed_Password TEXT NOT NULL,
        FOREIGN KEY (Business_ID) REFERENCES BUSINESS_TABLE(Business_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS JOB_TABLE (
        Job_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Description TEXT NOT NULL,
        URL TEXT NOT NULL,
        Due_Date DATETIME
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS CURRENT_JOB (
        User_ID INTEGER,
        Job_ID INTEGER,
        PRIMARY KEY (User_ID, Job_ID),
        FOREIGN KEY (User_ID) REFERENCES USER_TABLE(User_ID),
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS JOB_HISTORY (
        History_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        User_ID INTEGER,
        Job_ID INTEGER,
        Completion_Date DATETIME,
        Remarks TEXT,
        FOREIGN KEY (User_ID) REFERENCES USER_TABLE(User_ID),
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS CHAT_MESSAGES (
        Message_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        User_ID INTEGER,
        Job_ID INTEGER,
        Message_Content TEXT NOT NULL,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        Is_Read BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (User_ID) REFERENCES USER_TABLE(User_ID),
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
        Notification_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        User_ID INTEGER,
        Job_ID INTEGER,
        Notification_Content TEXT NOT NULL,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        Is_Read BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (User_ID) REFERENCES USER_TABLE(User_ID),
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
        `
    CREATE TABLE IF NOT EXISTS SUBSCRIPTION_TABLE (
        Subscription_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Endpoint TEXT NOT NULL,
        Auth_Key1 TEXT NOT NULL,
        Auth_Key2 TEXT NOT NULL,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID)
    )
    `,
];

// execute create queries
createTables.forEach((query) => {
    db.run(query, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created or already exists.');
        }
    });
});

// close connections
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});


