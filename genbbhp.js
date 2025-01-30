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


export const getAllOpenJobs = async (userId = '') => {


    
};

