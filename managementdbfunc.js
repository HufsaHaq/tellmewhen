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
  database: 'z26101hh',
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

//Add new business
// links to register page - this creates admin user - new users can be added through admin management page
export const registerBusinessAndAdmin= async (businessName, username , password) => {
  const defaultPhoto = 'base64photo_url';
  const insertBusinessQuery = `INSERT INTO BUSINESS_TABLE (Business_Name, Business_Photo) VALUES (?, ?);`;
  const businessResult = await executeQuery(insertBusinessQuery, [businessName, defaultPhoto]);

  const businessId = businessResult.insertId;
  const insertAdminQuery = `INSERT INTO WORKER_TABLE (Username, Hashed_Password, Business_ID, Privilege_level) VALUES (?, ?, ?, ?);`;
  return await executeQuery(insertAdminQuery, [username, password, businessId, 1]); // Privilege level 1 = admin
};

// Add worker/manager/admin
export const addUser = async (username, hashedPassword, businessId, privilegeLevel) => {
  const sql = `INSERT INTO WORKER_TABLE (Username, Hashed_Password, Business_ID, Privilege_level) VALUES (?, ?, ?, ?);`;
  return executeQuery(sql, [username, hashedPassword, businessId, privilegeLevel]);
};

// Delete worker/manager/admin
export const deleteUser = async (workerId, currID) => {
  const sql = `DELETE FROM WORKER_TABLE WHERE Worker_ID = ? AND Worker_ID <> ?;`;
  return executeQuery(sql, [workerId, currID]);
};

export const getLoginCredentials = async (username, password) => {
  const sql = `SELECT Worker_ID, Business_ID, Privilege_level, Hashed_Password FROM WORKER_TABLE WHERE Username = ?; `;
  return executeQuery(sql, [username, password]);
};

// Edit worker/manager/admin login details
export const editUserLogin = async (workerId, Username, newPassword) => {
  const sql = `UPDATE WORKER_TABLE SET Hashed_Password = ? WHERE Worker_ID = ? AND Username = ?;`;
  return executeQuery(sql, [newPassword, workerId, Username]);
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
  const sql = `SELECT * FROM WORKER_TABLE WHERE Username LIKE ? OR Worker_ID = ?;`;
  const term = `%${searchTerm}%`;
  return executeQuery(sql, [term, searchTerm]);
};

// Change privilege levels
export const changePrivilegeLevel = async (workerId, newPrivilegeLevel) => {
  const sql = `UPDATE WORKER_TABLE SET Privilege_level = ? WHERE Worker_ID = ?;`;
  return executeQuery(sql, [newPrivilegeLevel, workerId]);
};

// Get business name and photo
export const getBusinessDetails = async (businessId) => {
  const sql = `SELECT Business_Name, Business_Photo FROM BUSINESS_TABLE WHERE Business_ID = ?;`;
  
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

// Rename a business
export const renameBusiness = async (businessId, newName) => {
  const sql = `UPDATE BUSINESS_TABLE SET Business_Name = ? WHERE Business_ID = ?;`;
  return executeQuery(sql, [newName, businessId]);
};

// Change business photo
export const changeBusinessPhoto = async (businessId, newPhotoBase64) => {
  const sql = `UPDATE BUSINESS_TABLE SET Business_Photo = ? WHERE Business_ID = ?;`;  
  return executeQuery(sql, [newPhotoBase64, businessId]);
}

export const getBusinessPhoto = async (businessId) => {
  const sql = `SELECT Business_Photo FROM BUSINESS_TABLE WHERE Business_ID = ?;`;
  
  const result = await executeQuery(sql, [businessId]);
  
  if (result[0]) {
    return result[0].Business_Photo;
  } else {
    return null;
  }
}

//----------------------------------------------------------------
const testFunctions = async () => {
  try {
    // Add a business
    await registerBusinessAndAdmin('tellmewhen', 'admin1', 'hashedandsaltedpassword')
    console.log('Business added.');
    // Add a worker
    await addUser('JohnDoe', 'hashedPassword123', 1, 2);
    console.log('Worker added.');

    // Delete a worker
    await deleteUser(1,2);
    console.log('Worker deleted.');

    // Edit login details
    await editUserLogin(2, 'JaneDoe', 'newHashedPassword');
    console.log('Worker login updated.');

    // Delete a business
    //await deleteBusiness(1);
    //console.log('Business deleted.');

    // Count open jobs
    const openJobs = await countOpenJobs();
    console.log('Open jobs:', openJobs);

    // Count total jobs created
    const totalJobs = await countTotalJobs();
    console.log('Total jobs created:', totalJobs);

    // Search employees
    const employees = await searchEmployees('JohnDoe');
    console.log('Employees found:', employees);

    // Change privilege level
    await changePrivilegeLevel(2, 1);
    console.log('Privilege level updated.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    db.end();
  }
};

testFunctions();