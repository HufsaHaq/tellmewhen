// Get all open jobs for certain user id ( send empty paeameter for manager)
import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const {
  randomBytes,
} = await import('node:crypto');


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
    
const addNotification = async (userId, jobId, notificationContent) => {
    let sql = `INSERT INTO NOTIFICATIONS (User_ID, Job_ID, Notification_Content) VALUES (?, ?, ?);`;
    return executeQuery(sql, [userId, jobId, notificationContent]);
    };
  
// jobs per user or all jobs if no user ID 
const getOpenJobs = async (businessId, userId = null) => {
  let sql = `
    SELECT JOB_TABLE.Job_ID, JOB_TABLE.Description, JOB_TABLE.URL, JOB_TABLE.Due_Date
    FROM JOB_TABLE
    LEFT JOIN CURRENT_JOB ON JOB_TABLE.Job_ID = CURRENT_JOB.Job_ID
    WHERE JOB_TABLE.Business_ID = ?
  `;

  const params = [businessId];

  if (userId) {
    sql += ' AND JOB_TABLE.User_ID = ?';
    params.push(userId);
  }

  return execute(sql, params);
};

// job history
const getJobHistory = async (businessId, userId = null) => {
  let sql = `
    SELECT 
      JOB_HISTORY.Job_ID, 
      JOB_HISTORY.Description, 
      JOB_HISTORY.Completion_Date, 
      JOB_HISTORY.Remarks
    FROM JOB_HISTORY
    WHERE JOB_HISTORY.Business_ID = ?
  `;

  const params = [businessId];

  if (userId) {
    sql += ' AND JOB_HISTORY.User_ID = ?';
    params.push(userId);
  }

  return execute(sql, params);
};

// Function to create a new job
const createNewJob = async (businessId, userId = null, description, url, dueDate) => {
  const sql = `
    INSERT INTO JOB_TABLE (Business_ID, User_ID, Description, URL, Due_Date)
    VALUES (?, ?, ?, ?, ?);
  `;

  return execute(sql, [businessId, userId, description, url, dueDate]);
};
//----------------------------------------------------------------
const getJobDetails = async (jobId) => {
  const sql = `
    SELECT Job_ID, Description, URL, Due_Date
    FROM JOB_TABLE
    WHERE Job_ID = ?;
  `;

  const result = await execute(sql, [jobId]);

  if (result && result[0]) {
    return result[0]; 
  } else {
    return null; 
  }
};
//----------------------------------------------------------------

// assign  job
const assignJobToUser = async (userId, jobId) => {
  const sql = `
    UPDATE JOB_TABLE
    SET User_ID = ?
    WHERE Job_ID = ?;
  `;

  return execute(sql, [userId, jobId]);
};

// mark a job as completed (moves it to job history and removes from current jobs)
const completeJob = async (userId, jobId, remarks = '') => {
  const selectSql = `
    SELECT Business_ID, Description
    FROM JOB_TABLE
    WHERE Job_ID = ?;
  `;
  const jobDetails = await execute(selectSql, [jobId]);

  const insertSql = `
    INSERT INTO JOB_HISTORY (User_ID, Job_ID, Business_ID, Completion_Date, Description, Remarks)
    VALUES (?, ?, ?, NOW(), ?, ?);
  `;
  await execute(insertSql, [
    userId,
    jobId,
    jobDetails[0].Business_ID,
    jobDetails[0].Description,
    remarks,
  ]);

  const deleteSql = `
    DELETE FROM JOB_TABLE
    WHERE Job_ID = ?;
  `;
  await execute(deleteSql, [jobId]);

  console.log(`Job ${jobId} completed and moved to history.`);
};

// get notifications for a job
const getNotifications = async (jobId) => {
  let sql = `
    SELECT Notification_Content, Timestamp, Is_Read
    FROM NOTIFICATIONS
    WHERE Job_ID = ?
    ORDER BY Timestamp DESC
  `;
  return execute(sql, [userId]);
};

const getSubscription = async (jobId, businessId) => {
  const sql = `
    SELECT 
      SUBSCRIPTION_TABLE.Subscription_ID, 
      SUBSCRIPTION_TABLE.Endpoint, 
      SUBSCRIPTION_TABLE.Auth_Key1, 
      SUBSCRIPTION_TABLE.Auth_Key2
    FROM SUBSCRIPTION_TABLE
    JOIN JOB_TABLE ON SUBSCRIPTION_TABLE.Job_ID = JOB_TABLE.Job_ID
    WHERE JOB_TABLE.Job_ID = ? AND JOB_TABLE.Business_ID = ?;
  `;

  return execute(sql, [jobId, businessId]);
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

const testFunctions = async () => {
  try {
    const businessId = 1; 
    const userId = 5; 
    const jobId = 10; 


    const openAllJobs = await getOpenJobs(businessId);
    console.log('All open jobs for business:', openAllJobs);

    const openJobsForUser = await getOpenJobs(businessId, userId);
    console.log('Open jobs for user:', openJobsForUser);

    const jobHistoryForUser = await getJobHistory(businessId, userId);
    console.log('Job history for user:', jobHistoryForUser);

    const allJobHistory = await getJobHistory(businessId);
    console.log('All job history for business:', allJobHistory);

    const assignResult = await assignJobToUser(userId, jobId);
    console.log('Job assigned to user:', assignResult);

    const completeResult = await completeJob(userId, jobId, 'Completed successfully');
    console.log('Job completed:', completeResult);

    const notifications = await getNotifications(jobId);
    console.log('Notifications for job:', notifications);

    const subscription = await getSubscription(jobId, businessId);
    console.log('Subscription details:', subscription);

    const jobDetails = await getJobDetails(jobId);
    console.log('Job details:', jobDetails);

    closeDB();
  } catch (err) {
    console.error('Error during testing:', err.message);
  }
};

testFunctions();

export {
  addNotification,
  createNewJob,
  getNotifications,
  getOpenJobs,
  getJobHistory,
  assignJobToUser,
  completeJob,
  getSubscription,
  closeDB,
  getJobDetails,
};
