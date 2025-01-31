import express from 'express';
import { fetchAll, createConnection } from '../dbhelper.js';

var indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

indexRouter.get('/current_jobs/:bid', async (req, res) => {
  const businessId = req.params.bid;
  const sql = 'SELECT * FROM CURRENT_JOB WHERE User_id = ?';

  try {
    const connection = await createConnection();
    const jobs = await fetchAll(connection, sql, [businessId]);
    res.json(jobs);
    connection.end(); // Close the connection
  } catch (err) {
    res.json({ error: err });
  }
});

indexRouter.get('/job_history/:bid', async (req, res) => {
  const businessId = req.params.bid;
  const sql = 'SELECT * FROM JOB_HISTORY WHERE User_id = ?';

  try {
    const connection = await createConnection();
    const jobs = await fetchAll(connection, sql, [businessId]);
    res.json(jobs);
    connection.end(); // Close the connection
  } catch (err) {
    res.json({ error: err });
  }
});

indexRouter.post('/job:id/notify')


export { indexRouter }; 