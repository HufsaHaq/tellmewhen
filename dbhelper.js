// Get all open jobs for certain user id ( send empty paeameter for manager)
import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

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
const getJobHistory = async (userId = null) => {
  let sql = `SELECT JOB_TABLE.Job_ID, JOB_TABLE.Description, JOB_HISTORY.Completion_Date, JOB_HISTORY.Remarks FROM JOB_HISTORY JOIN JOB_TABLE ON JOB_HISTORY.Job_ID = JOB_TABLE.Job_ID`;

  const params = [];
  if (userId) {
    sql += ' WHERE JOB_HISTORY.User_ID = ?';
    params.push(userId);
  }

  return execute(sql, params);
};

// Function to create a new job
const createNewJob = async (description, url, dueDate) => {
  const sql = `INSERT INTO JOB_TABLE (Description, URL, Due_Date) VALUES (?, ?, ?);`;
  const jobResult = await execute(sql, [description, url, dueDate]);
  // Insert into MAPPING_TABLE
  await insertMapping(jobId);

};

// insert a random job id into the mapping table
const insertMapping = async (jobId) => {
  let randomId;
  let isUnique = false;

  // unique random ID and insert the mapping
  while (!isUnique) {
    randomId = Math.floor(100000 + Math.random() * 900000); // 6-digit random number

    // check unique
    const checkSql = `SELECT COUNT(*) AS count FROM MAPPING_TABLE WHERE Random_ID = ?;`;
    const result = await execute(checkSql, [randomId]);
    if(result[0].count === 0){
      isUnique = true;
    };

    if (isUnique) {
      // Insert the mapping into the MAPPING_TABLE
      const insertSql = `INSERT INTO MAPPING_TABLE (Random_ID, Job_ID) VALUES (?, ?);`;
      await execute(insertSql, [randomId, jobId]);
    }
  }
};

// assign  job
const assignJobToUser = async (userId, jobId) => {
  let sql = `INSERT INTO CURRENT_JOB (User_ID, Job_ID) VALUES (?, ?)`;
  return execute(sql, [userId, jobId]);
};

// mark a job as completed (moves it to job history and removes from current jobs)
const completeJob = async (userId, jobId, remarks = '') => {
  let sqlInsert = `
    INSERT INTO JOB_HISTORY (User_ID, Job_ID, Completion_Date, Remarks)
    VALUES (?, ?, NOW(), ?)
  `;
  let sqlDelete = `
    DELETE FROM CURRENT_JOB WHERE User_ID = ? AND Job_ID = ?
  `;
  
  await execute(sqlInsert, [userId, jobId, remarks]);
  return execute(sqlDelete, [userId, jobId]);
};

// get chat messages for a specific job
/*const getChatMessages = async (jobId) => {
    let  sql = `
    SELECT User_ID, Message_Content, Timestamp, Is_Read
    FROM CHAT_MESSAGES
    WHERE Job_ID = ?
    ORDER BY Timestamp ASC
  `;
  return execute(sql, [jobId]);
};
*/
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

const getSubscription = async (jobId,businessId) => {
  let sql = `
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

const testFunctions = async () => {
  try {
    const openall = await getOpenJobs();
    console.log('Get open jobs with no user id :' + openall);
    
    const open = await getOpenJobs(5);
    console.log('Get open jobs with user id 5'+ open);

    var history = await getJobHistory(5);
    console.log('Get job history :'+ history);

    var historyall = await getJobHistory();
    console.log('Get job history :'+ historyall);
    
    var assign = await assignJobToUser(15, 1);
    console.log('Assign job :'+ assign);
    
    var complete = await completeJob(5, 1, 'Completed');
    console.log('Complete job :'+ complete);
    
    /*var messages = await getChatMessages(1);
    console.log('Get chat messages :'+ messages);*/
    
    var notifications = await getNotifications(5);
    console.log('Get notifications :'+ notifications);
    
    var subscription = await getSubscription(1, 1);
    console.log('Get subscription :'+ subscription);
    
    closeDB();

  }
  catch (err) {
    console.error('Error:', err.message);
  }
};

testFunctions();

export {addNotification,createNewJob,  getNotifications, getOpenJobs, getJobHistory, assignJobToUser, completeJob, getSubscription, closeDB};
