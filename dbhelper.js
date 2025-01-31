// Get all open jobs for certain user id ( send empty paeameter for manager)
import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'dbhost.cs.man.ac.uk',
  user: 'z26101hh',
  password: 'UTZxLV/au62nauNC7XxBhNsvh5Wm7CcShrtKz4bwj24',
  database: 'tellmewhen',
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the MySQL database.');
    }
  });

const executeQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

// Get all open jobs for a certain user (or all jobs if no user ID is provided)
const getOpenJobs = async (userId = null) => {
  let sql = `
    SELECT JOB_TABLE.Job_ID, JOB_TABLE.Description, JOB_TABLE.URL, JOB_TABLE.Due_Date
    FROM JOB_TABLE
    LEFT JOIN CURRENT_JOB ON JOB_TABLE.Job_ID = CURRENT_JOB.Job_ID
  `;

  const params = [];
  if (userId) {
    sql += ' WHERE CURRENT_JOB.User_ID = ?';
    params.push(userId);
  }

  return executeQuery(sql, params);
};

// Get job history for a user
const getJobHistory = async (userId) => {
  const sql = `
    SELECT JOB_TABLE.Job_ID, JOB_TABLE.Description, JOB_HISTORY.Completion_Date, JOB_HISTORY.Remarks
    FROM JOB_HISTORY
    JOIN JOB_TABLE ON JOB_HISTORY.Job_ID = JOB_TABLE.Job_ID
    WHERE JOB_HISTORY.User_ID = ?
  `;
  return executeQuery(sql, [userId]);
};

// Assign a job to a user
const assignJobToUser = async (userId, jobId) => {
  const sql = `
    INSERT INTO CURRENT_JOB (User_ID, Job_ID) VALUES (?, ?)
  `;
  return executeQuery(sql, [userId, jobId]);
};

// Mark a job as completed (moves it to job history and removes from current jobs)
const completeJob = async (userId, jobId, remarks = '') => {
  const sqlInsert = `
    INSERT INTO JOB_HISTORY (User_ID, Job_ID, Completion_Date, Remarks)
    VALUES (?, ?, NOW(), ?)
  `;
  const sqlDelete = `
    DELETE FROM CURRENT_JOB WHERE User_ID = ? AND Job_ID = ?
  `;
  
  await executeQuery(sqlInsert, [userId, jobId, remarks]);
  return executeQuery(sqlDelete, [userId, jobId]);
};

// Get chat messages for a specific job
const getChatMessages = async (jobId) => {
  const sql = `
    SELECT User_ID, Message_Content, Timestamp, Is_Read
    FROM CHAT_MESSAGES
    WHERE Job_ID = ?
    ORDER BY Timestamp ASC
  `;
  return executeQuery(sql, [jobId]);
};

// Get notifications for a user
const getNotifications = async (userId) => {
  const sql = `
    SELECT Notification_Content, Timestamp, Is_Read
    FROM NOTIFICATIONS
    WHERE User_ID = ?
    ORDER BY Timestamp DESC
  `;
  return executeQuery(sql, [userId]);
};

const closeDB = () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
};


