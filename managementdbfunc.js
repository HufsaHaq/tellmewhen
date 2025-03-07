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
import dotenv from 'dotenv';
import { access } from 'fs';
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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

export const closeDB = () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
};

//login need to crosscheck with business tabvle to check if user belongs to business
export const login = async (buisness, username) => {
  const selectbusinessid = 'SELECT Business_ID FROM BUSINESS_TABLE WHERE Business_Name = ?;';
  const sql = 'SELECT * FROM WORKER_TABLE WHERE Username =? AND Business_ID =? ;';
  const businessIdResult = await executeQuery(selectbusinessid, [buisness]);
  if(businessIdResult.length > 0){
    const result = await executeQuery(sql, [username, businessIdResult[0].Business_ID]);
    console.log(result)
    return result[0];
  }else{
    console.log('No such name')
    return 0;
  }
};

//Add new business
// links to register page - this creates admin user - new users can be added through admin management page

export const registerBusinessAndAdmin = async (businessName, username, password) => {
  const defaultPhoto = 'base64photo_url';
  
  try {
    const checkBusinessSql = 'SELECT Business_ID FROM BUSINESS_TABLE WHERE Business_Name = ?;';
    const existingBusiness = await executeQuery(checkBusinessSql, [businessName]);

    if (existingBusiness.length > 0) {
      console.log('Business already exists');
      throw new Error('Business already exists');
    }

    const insertBusinessSql = 'INSERT INTO BUSINESS_TABLE (Business_Name, Business_Photo) VALUES (?, ?);';
    const businessResult = await executeQuery(insertBusinessSql, [businessName, defaultPhoto]);

    const businessId = businessResult.insertId;
    
    const insertAdminSql = 'INSERT INTO WORKER_TABLE (Username, Hashed_Password, Business_ID, Privilege_level) VALUES (?, ?, ?, ?);';
    
    return await executeQuery(insertAdminSql, [
      username, 
      password, 
      businessId, 
      1 // Privilege level 1 = admin2s
    ]);

  } catch (error) {
    console.log('Registration failed:', error.message);
    return null;
  }
};

// Add worker/manager/admin
export const addUser = async (username, hashedPassword, businessId, privilegeLevel) => {
  const sql = 'INSERT INTO WORKER_TABLE (Username, Hashed_Password, Business_ID, Privilege_level) VALUES (?, ?, ?, ?);';
  return executeQuery(sql, [username, hashedPassword, businessId, privilegeLevel]);
};

// Delete worker/manager/admin
export const deleteUser = async (workerId, currID) => {
  // find admin in the same business as the user being deleted
  const bid = 'SELECT Business_ID FROM WORKER_TABLE WHERE User_ID = ?;';
  const findAdminSQL = 'SELECT User_ID FROM WORKER_TABLE WHERE Business_ID = ? AND Privilege_level = 1 LIMIT 1;'

  // reassign all open jobs from the user being deleted to the admin
  const reassignJobsSQL = 'UPDATE JOB_TABLE SET User_ID = ? WHERE User_ID = ?;';

  //Delete the user from the WORKER_TABLE
  const deleteUserSQL = 'DELETE FROM WORKER_TABLE WHERE User_ID = ? AND User_ID <> ?;';

  try{
    const business_id = await executeQuery(bid,[workerId])
    const adminResult = await executeQuery(findAdminSQL, [business_id]);
    if (adminResult.length === 0) {
      throw new Error('No admin found in the same business to reassign jobs.');
    }
    const adminId = adminResult[0].User_ID;

    await executeQuery(reassignJobsSQL, [adminId, workerId]);
    await executeQuery(deleteUserSQL, [workerId, currID]);

    console.log('User ${workerId} deleted - jobs reassigned to admin ${adminId}.');
  } catch (error) {
    console.error('Error deleting user and reassigning jobs:', error.message);
  }
};

export const workernames = async (businessId) => {
  const sql = 'SELECT Username FROM WORKER_TABLE WHERE Business_ID =?;';
  return executeQuery(sql, [businessId]);
};

// Edit worker/manager/admin login details
export const editUserLogin = async (workerId, Username, newPassword) => {
  const sql = 'UPDATE WORKER_TABLE SET Hashed_Password = ? WHERE User_ID = ? AND Username = ?;';
  return executeQuery(sql, [newPassword, workerId, Username]);
};

// Delete business account and all associated accounts
export const deleteBusiness = async (businessId) => {
  const sqlJobHistory = 'DELETE FROM JOB_HISTORY WHERE Business_ID = ?;';
  const sqlJobTable = 'DELETE FROM JOB_TABLE WHERE Business_ID = ?;';
  const sqlSubscriptionTable = 'DELETE FROM SUBSCRIPTION_TABLE WHERE Business_ID = ?;';
  const sqlNotifications = 'DELETE FROM NOTIFICATIONS WHERE Business_ID = ?;';
  const sqlTokens = 'DELETE FROM TOKENS WHERE User_ID IN (SELECT User_ID FROM WORKER_TABLE WHERE Business_ID = ?);';
  const sqlWorkers = 'DELETE FROM WORKER_TABLE WHERE Business_ID = ?;';
  const sqlBusiness = 'DELETE FROM BUSINESS_TABLE WHERE Business_ID = ?;';

  try {
    // Delete related records in JOB_HISTORY
    await executeQuery(sqlJobHistory, [businessId]);

    // Delete related records in JOB_TABLE
    await executeQuery(sqlJobTable, [businessId]);

    // Delete related records in SUBSCRIPTION_TABLE
    await executeQuery(sqlSubscriptionTable, [businessId]);

    // Delete related records in NOTIFICATIONS
    await executeQuery(sqlNotifications, [businessId]);

    // Delete related records in TOKENS
    await executeQuery(sqlTokens, [businessId]);

    // Delete workers associated with the business
    await executeQuery(sqlWorkers, [businessId]);

    await executeQuery(sqlBusiness, [businessId]);

    console.log('Business with ID ${businessId} and all associated records deleted successfully.');
  } catch (error) {
    console.error('Error deleting business and associated records:', error.message);
  }
};

// Get the number of open jobs
export const countOpenJobs = async (businessId) => {
    // SQL query to count the number of open jobs
    const sql = 'SELECT COUNT(*) AS openJobs FROM JOB_TABLE WHERE Business_ID = ?;';
    
    const result = await executeQuery(sql, [businessId]);
    
    // if there is a result return the openJobs count or need to return 0 to prevent error
    if (result[0]) {
      return result[0].openJobs;
    } else {
      return 0;
    }
};
  
// Get the total number of jobs created
export const countTotalJobs = async (businessId) => {
  try {
    const openJobsSql = 'SELECT COUNT(*) AS totalOpenJobs FROM JOB_TABLE WHERE Business_ID = ?;';
    const openJobsResult = await executeQuery(openJobsSql, [businessId]);
    const closedJobsSql = 'SELECT COUNT(*) AS totalClosedJobs FROM JOB_HISTORY WHERE Business_ID = ?;';
    const closedJobsResult = await executeQuery(closedJobsSql, [businessId]);

    const totalOpenJobs = openJobsResult[0]?.totalOpenJobs || 0;
    const totalClosedJobs = closedJobsResult[0]?.totalClosedJobs || 0;

    // Return the counts as an object
    return totalOpenJobs + totalClosedJobs;
  } catch (error) {
    console.error('Error counting jobs:', error.message);
    throw error; 
  }
};

export const searchEmployees = async (searchTerm, businessId,limit = null) => {
    const sql = 'SELECT * FROM WORKER_TABLE WHERE Business_ID = ?;';
    params = [businessId]

    if(searchTerm){

      params.push(['%${searchTerm}%', searchTerm, businessId]);
      sql = sql + 'AND (Username LIKE ? OR User_ID = ?)'

    }if(limit){

      sql = sql + 'LIMIT ?'
      params.push(limit)
      
    }

    return executeQuery(sql, params);
};

// Change privilege levels
export const changePrivilegeLevel = async (workerId, newPrivilegeLevel) => {
  const sql = 'UPDATE WORKER_TABLE SET Privilege_level = ? WHERE User_ID = ?;';
  return executeQuery(sql, [newPrivilegeLevel, workerId]);
};

// Get business name and photo
export const getBusinessDetails = async (businessId) => {
  const sql = 'SELECT Business_Name, Business_Photo FROM BUSINESS_TABLE WHERE Business_ID = ?;';
  
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
      const checkNameQuery = 'SELECT Business_ID FROM BUSINESS_TABLE WHERE Business_Name = ?;';
      const existingBusiness = await executeQuery(checkNameQuery, [newName]);

      // If a business with the new name already exists (and it's not the current business)
      if (existingBusiness.length > 0 && existingBusiness[0].Business_ID !== businessId) {
          //throw new Error("Business name already exists. Please choose a different name.");
          return null;
      }
      const updateQuery = 'UPDATE BUSINESS_TABLE SET Business_Name = ? WHERE Business_ID = ?;';
      return executeQuery(updateQuery, [newName, businessId]);
};

// Change business photo
export const changeBusinessPhoto = async (businessId, newPhotoBase64) => {
  const sql = 'UPDATE BUSINESS_TABLE SET Business_Photo = ? WHERE Business_ID = ?;';  
  return executeQuery(sql, [newPhotoBase64, businessId]);
}

export const getBusinessPhoto = async (businessId) => {
  const sql = 'SELECT Business_Photo FROM BUSINESS_TABLE WHERE Business_ID = ?;';
  
  const result = await executeQuery(sql, [businessId]);
  
  if (result[0]) {
    return result[0].Business_Photo;
  } else {
    return null;
  }
}

export const getBusinessId = async (businessName) => {
  const sql = 'SELECT Business_ID FROM BUSINESS_TABLE WHERE Business_Name = ?;';

  const result = await executeQuery(sql, [businessName]);

  if (result[0]) {
    return result[0].Business_ID;
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

// testFunctions();