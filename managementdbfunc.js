//Add worker/manager/admin
//delete worker/manager/admin
//edit worker/manager/admin login
//delete buisness account - all associtated account with buisness id deleted
//number of open jobs
//TOTAL JOBS CREATED
// search for employees based name/id 
// chnage privilege levels


import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'dbhost.cs.man.ac.uk',
  user: 'z26101hh',
  password: 'UTZxLV/au62nauNC7XxBhNsvh5Wm7CcShrtKz4bwj24',
  database: 'tellmewhen',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

// Helper function to execute queries
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

// Add worker/manager/admin
export const addUser = async (username, hashedPassword, businessId, privilegeLevel) => {
    const sql = `
      INSERT INTO WORKER_TABLE (Username, Hashed_Password, Business_ID, Privilege_level)
      VALUES (?, ?, ?, ?);
    `;
    return executeQuery(sql, [username, hashedPassword, businessId, privilegeLevel]);
  };
  
// Delete worker/manager/admin
export const deleteUser = async (workerId) => {
    const sql = `
      DELETE FROM WORKER_TABLE WHERE Worker_ID = ?;
    `;
    return executeQuery(sql, [workerId]);
  };