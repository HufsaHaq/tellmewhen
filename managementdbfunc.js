//Add worker/manager/admin DONE
//delete worker/manager/admin DONE
//edit worker/manager/admin login DONE
//delete buisness account - all associtated account with buisness id deleted DONE
//number of open jobs DONE
//TOTAL JOBS CREATED DONE
// search for employees based name/id  DONE
// chnage privilege levels DONE
// need to add func to return buisness name and pfp DONE


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

// Edit worker/manager/admin login details
export const editUserLogin = async (workerId, Username, newPassword) => {
  const sql = `
    UPDATE WORKER_TABLE
    SET Hashed_Password = ?
    WHERE Worker_ID = ? AND Username = ?;
  `;
  return executeQuery(sql, [hash(newPassword), workerId, Username]);
};

// Delete business account and all associated accounts
export const deleteBusiness = async (businessId) => {
  const sqlWorkers = `DELETE FROM WORKER_TABLE WHERE Business_ID = ?;`;
  const sqlBusiness = `DELETE FROM BUSINESS_TABLE WHERE Business_ID = ?;`;

  // need to delete workers then the business
  await executeQuery(sqlWorkers, [businessId]);
  return executeQuery(sqlBusiness, [businessId]);
};

// Get the number of open jobs
export const countOpenJobs = async () => {
    // SQL query to count the number of open jobs
    const sql = `SELECT COUNT(*) AS openJobs FROM CURRENT_JOB;`;
    
    const result = await executeQuery(sql);
    
    // if there is a result return the openJobs count or need to return 0 to prevent error
    if (result[0]) {
      return result[0].openJobs;
    } else {
      return 0;
    }
  };
  
  // Get the total number of jobs created
  export const countTotalJobs = async () => {
    // SQL query to count the total number of jobs
    const sql = `SELECT COUNT(*) AS totalJobs FROM JOB_TABLE;`;
    
    const result = await executeQuery(sql);
    
    // if there is a result return the totalJobs count or need to return 0 to prevent error
    if (result[0]) {
      return result[0].totalJobs;
    } else {
      return 0;
    }
  };

// Search for employees by name or ID
export const searchEmployees = async (searchTerm) => {
  const sql = `
    SELECT * FROM WORKER_TABLE
    WHERE Username LIKE ? OR Worker_ID = ?;
  `;
  const term = `%${searchTerm}%`;
  return executeQuery(sql, [term, searchTerm]);
};

// Change privilege levels
export const changePrivilegeLevel = async (workerId, newPrivilegeLevel) => {
  const sql = `
    UPDATE WORKER_TABLE
    SET Privilege_level = ?
    WHERE Worker_ID = ?;
  `;
  return executeQuery(sql, [newPrivilegeLevel, workerId]);
};

// Get business name and photo
export const getBusinessDetails = async (businessId) => {
  const sql = `
    SELECT Business_Name, Business_Photo 
    FROM BUSINESS_TABLE 
    WHERE Business_ID = ?;
  `;
  
  const result = await executeQuery(sql, [businessId]);
  
  if (result[0]) {
    const { Business_Name, Business_Photo } = result[0];
    return {
      name: Business_Name,
      photo: Business_Photo, // Already stored as base64 encoded
    };
  } else {
    return null;
  }
};


