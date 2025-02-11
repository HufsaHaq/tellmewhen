// for reference : https://www.w3schools.com/nodejs/nodejs_mysql_create_table.asp 
// https://github.com/mysqljs/mysql
// https://www.geeksforgeeks.org/how-to-create-table-in-sqlite3-database-using-node-js/?ref=gcse_outind (BEST ONE)
import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'dbhost.cs.man.ac.uk',
    user: 'z26101hh',
    password: 'UTZxLV/au62nauNC7XxBhNsvh5Wm7CcShrtKz4bwj24',
    database: 'z26101hh'
});

// Connect to the database

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

// excecute - split tables 
export const executeQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
});

export const createbusiness = async () => {
  const sql = `CREATE TABLE IF NOT EXISTS BUSINESS_TABLE (Business_ID INT AUTO_INCREMENT PRIMARY KEY,Business_Name VARCHAR(255) ,Business_Photo VARCHAR(255));`;

  return executeQuery(sql);

};

export const createworker = async () => {
  const sql =     `CREATE TABLE IF NOT EXISTS WORKER_TABLE (Worker_ID INT AUTO_INCREMENT PRIMARY KEY,Username VARCHAR(255) NOT NULL,Business_ID INT,Privilege_level INT,Hashed_Password VARCHAR(255) NOT NULL,FOREIGN KEY (Business_ID) REFERENCES BUSINESS_TABLE(Business_ID));`;

  return executeQuery(sql);

};

export const createjob = async () => {
  const sql =     `CREATE TABLE IF NOT EXISTS JOB_TABLE (Job_ID INT AUTO_INCREMENT PRIMARY KEY, Description VARCHAR(255) NOT NULL,URL VARCHAR(255) NOT NULL,Due_Date DATETIME);`;

  return executeQuery(sql);
};

export const createcurrentjob = async () => {
  const sql =     `CREATE TABLE IF NOT EXISTS CURRENT_JOB (User_ID INT,Job_ID INT,PRIMARY KEY (User_ID, Job_ID),FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID),FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID));`;

  return executeQuery(sql);
};

export const createjobhistory = async () => {
  const sql =     `CREATE TABLE IF NOT EXISTS JOB_HISTORY (History_ID INT AUTO_INCREMENT PRIMARY KEY,User_ID INT,Job_ID INT,Completion_Date DATETIME,Remarks VARCHAR(255),FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID),FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID));`;

  return executeQuery(sql);
};

/*export const createchat_messages = async () => {
  const sql =     `CREATE TABLE IF NOT EXISTS CHAT_MESSAGES (Message_ID INT AUTO_INCREMENT PRIMARY KEY,User_ID INT,Job_ID INT,Message_Content VARCHAR(255) NOT NULL,Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,Is_Read BOOLEAN DEFAULT FALSE,FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID),FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID));`;
  return executeQuery(sql);
};*/

export const createsubscription_table = async () => {
  const sql =     `CREATE TABLE IF NOT EXISTS SUBSCRIPTION_TABLE (Subscription_ID INT AUTO_INCREMENT PRIMARY KEY,Endpoint VARCHAR(255) NOT NULL,Auth_Key1 VARCHAR(255) NOT NULL,Auth_Key2 VARCHAR(255) NOT NULL,Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,Job_ID INT,FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID));`;

  return executeQuery(sql);
};

export const createnotification = async () => {
  const sql =     `CREATE TABLE IF NOT EXISTS NOTIFICATIONS (Notification_ID INT AUTO_INCREMENT PRIMARY KEY,User_ID INT,Job_ID INT,Notification_Content VARCHAR(255) NOT NULL,Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,Is_Read BOOLEAN DEFAULT FALSE,FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID),FOREIGN KEY (Job_ID) REFERENCES JOB_TABLE(Job_ID));`;
  return executeQuery(sql);
};

export const createaccesstoken = async () => {
  const sql =     `CREATE TABLE IF NOT EXISTS ACCESS_TOKENS (Token_ID INT AUTO_INCREMENT PRIMARY KEY,User_ID INT NOT NULL,Access_Token VARCHAR(255) NOT NULL,Expiration_Time DATETIME NOT NULL,FOREIGN KEY (User_ID) REFERENCES WORKER_TABLE(Worker_ID));`;
  return executeQuery(sql);
};

export const populateDatabase = async () => {
  try {
      // Insert into BUSINESS_TABLE
      const businessResult = await executeQuery(
          "INSERT INTO BUSINESS_TABLE (Business_Name, Business_Photo) VALUES (?, ?)",
          ['TechCorp', 'techcorp.png']
      );
      const businessId = businessResult.insertId;

      // Insert into WORKER_TABLE
      const workerResult = await executeQuery(
          "INSERT INTO WORKER_TABLE (Username, Business_ID, Privilege_level, Hashed_Password) VALUES (?, ?, ?, ?)",
          ['johndoe', businessId, 1, 'hashed_password']
      );
      const workerId = workerResult.insertId;

      // Insert into JOB_TABLE
      const jobResult = await executeQuery(
          "INSERT INTO JOB_TABLE (Description, URL, Due_Date) VALUES (?, ?, ?)",
          ['Fix server issues', 'https://techcorp.com/job/1', '2025-03-01 12:00:00']
      );
      const jobId = jobResult.insertId;



      // Insert into CURRENT_JOB
      await executeQuery(
          "INSERT INTO CURRENT_JOB (User_ID, Job_ID) VALUES (?, ?)",
          [workerId, jobId]
      );

      // Insert into JOB_HISTORY
      await executeQuery(
          "INSERT INTO JOB_HISTORY (User_ID, Job_ID, Completion_Date, Remarks) VALUES (?, ?, ?, ?)",
          [workerId, jobId, '2025-02-01 18:00:00', 'Job completed successfully']
      );

      // Insert into CHAT_MESSAGES
      /*await executeQuery(
          "INSERT INTO CHAT_MESSAGES (User_ID, Job_ID, Message_Content) VALUES (?, ?, ?)",
          [workerId, jobId, 'Is this issue still happening?']
      );*/

      // Insert into SUBSCRIPTION_TABLE
      await executeQuery(
          "INSERT INTO SUBSCRIPTION_TABLE (Endpoint, Auth_Key1, Auth_Key2, Job_ID) VALUES (?, ?, ?, ?)",
          ['https://pushservice.com', 'authkey1', 'authkey2', jobId]
      );

      // Insert into NOTIFICATIONS
      await executeQuery(
          "INSERT INTO NOTIFICATIONS (User_ID, Job_ID, Notification_Content) VALUES (?, ?, ?)",
          [workerId, jobId, 'New job assigned to you']
      );

      // Insert into ACCESS_TOKENS
      await executeQuery(
          "INSERT INTO ACCESS_TOKENS (User_ID, Access_Token, Expiration_Time) VALUES (?, ?, ?)",
          [workerId, 'randomaccesstoken', '2025-03-01 23:59:59']
      );

      console.log('Database populated successfully!');
  } catch (error) {
      console.error('Error populating database:', error.message);
  } finally {
      db.end();
  }
};


//run create func

(async () => {
  await createbusiness();
  await createworker();
  await createjob();
  await createcurrentjob();
  await createjobhistory();
  //await createchat_messages();
  await createsubscription_table();
  await createnotification();
  await createaccesstoken();
  await populateDatabase(); 
})();

