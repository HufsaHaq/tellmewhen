import express from 'express';
import { fetchAll,createConnection,execute } from '../dbhelper.js';
var indexRouter = express.Router();


/* GET home page. */
indexRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


indexRouter.get('/current_jobs/:bid', async (req,res)=>{
  // get data from db and send as json to front-end
  // bid = business id
  const businessId = req.params.bid
  //construct sql query
  const sql = 'SELECT * FROM CURRENT_JOB WHERE User_id = ?'

  try{
    const connection = await createConnection()
    const jobs = fetchAll(connection,sql,[businessId])
    res.json(jobs)
  }catch(err){  
    res.json({error:err})
  }

})

indexRouter.get('/job_history/:bid', async (req,res)=>{
  // get data from db and send as json to front-end
  // bid = business id
  const businessId = req.params.bid
  //construct sql query
  const sql = 'SELECT * FROM JOB_HISTORY WHERE User_id = ?'

  try{
    const connection = await createConnection()
    const jobs = fetchAll(connection,sql,[businessId])
    res.json(jobs)
  }catch(err){  
    res.json({error:err})
  }
})

indexRouter.post('/send_nottification/:jid', async (req,res)=>{
  // get the customer endpoints from the db and send a nottification through web-push
  const jobId = req.params.jid

  
})
export { indexRouter };
