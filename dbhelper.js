// Get all open jobs for certain user id ( send empty paeameter for manager)
import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'dbhost.cs.man.ac.uk',
  user: 'z26101hh',
  password: 'UTZxLV/au62nauNC7XxBhNsvh5Wm7CcShrtKz4bwj24',
  database: 'z26101hh',
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the MySQL database.');
    }
  });

const execute = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(results)); // might return a json object

        }
      });
    });

//----------------------------------------------------------------------------------------------------
export const storeAccessToken = async (userId, accessToken, expirationTime) => {
      const sql = `
        INSERT INTO ACCESS_TOKENS (User_ID, Access_Token, Expiration_Time)
        VALUES (?, ?, ?);
      `;
      return execute(sql, [userId, accessToken, expirationTime]);
    };

export const validateAccessToken = async (accessToken) => {
      const sql = `
        SELECT User_ID, Expiration_Time 
        FROM ACCESS_TOKENS 
        WHERE Access_Token = ? AND Expiration_Time > NOW();
      `;
      const result = await executeQuery(sql, [accessToken]);
    
      if (result.length > 0) {
        return result[0].User_ID; // Return the user ID if the token is valid
      } else {
        return null; // Token is invalid or expired
      }
    };

export const deleteExpiredTokens = async () => {
      const sql = `
        DELETE FROM ACCESS_TOKENS 
        WHERE Expiration_Time <= NOW();
      `;
      return executeQuery(sql);
    };
//-----------------------------------------------------------------------------------------------------

// jobs per user or all jobs if no user ID 
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

  return execute(sql, params);
};

// job history
const getJobHistory = async (userId) => {
  const sql = `
    SELECT JOB_TABLE.Job_ID, JOB_TABLE.Description, JOB_HISTORY.Completion_Date, JOB_HISTORY.Remarks
    FROM JOB_HISTORY
    JOIN JOB_TABLE ON JOB_HISTORY.Job_ID = JOB_TABLE.Job_ID
    WHERE JOB_HISTORY.User_ID = ?
  `;
  return execute(sql, [userId]);
};

// assign  job
const assignJobToUser = async (userId, jobId) => {
  const sql = `
    INSERT INTO CURRENT_JOB (User_ID, Job_ID) VALUES (?, ?)
  `;
  return execute(sql, [userId, jobId]);
};

// mark a job as completed (moves it to job history and removes from current jobs)
const completeJob = async (userId, jobId, remarks = '') => {
  const sqlInsert = `
    INSERT INTO JOB_HISTORY (User_ID, Job_ID, Completion_Date, Remarks)
    VALUES (?, ?, NOW(), ?)
  `;
  const sqlDelete = `
    DELETE FROM CURRENT_JOB WHERE User_ID = ? AND Job_ID = ?
  `;
  
  await execute(sqlInsert, [userId, jobId, remarks]);
  return execute(sqlDelete, [userId, jobId]);
};

// get chat messages for a specific job
const getChatMessages = async (jobId) => {
  const sql = `
    SELECT User_ID, Message_Content, Timestamp, Is_Read
    FROM CHAT_MESSAGES
    WHERE Job_ID = ?
    ORDER BY Timestamp ASC
  `;
  return execute(sql, [jobId]);
};

// get notifications for a user
const getNotifications = async (userId) => {
  const sql = `
    SELECT Notification_Content, Timestamp, Is_Read
    FROM NOTIFICATIONS
    WHERE User_ID = ?
    ORDER BY Timestamp DESC
  `;
  return execute(sql, [userId]);
};

const getSubscription = async (jobId,businessId) => {
  const sql = `
    SELECT SUBSCRIPTION_TABLE.Subscription_ID, SUBSCRIPTION_TABLE.Endpoint, SUBSCRIPTION_TABLE.Auth_Key1,SUBSCRIPTION_TABLE.Auth_Key2
    FROM SUBSCRIPTION_TABLE
    JOIN CURRENT_JOB ON SUBSCRIPTION_TABLE.User_ID = CURRENT_JOB.User_ID
    WHERE CURRENT_JOB.Job_ID = ? AND CURRENT_JOB.User_ID = ?
  `;
  return execute(sql, [jobId,businessId]);
}

const closeDB = () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
};

export {getChatMessages, getNotifications, getOpenJobs, getJobHistory, assignJobToUser, completeJob, getSubscription, closeDB};
