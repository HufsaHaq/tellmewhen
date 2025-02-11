import {generate_qr} from '../qr_generation.js';
import express from 'express';
var qrRouter = express.Router();

qrRouter.get('/jobs/:job_id', async function(req, res, next) {
    const job_id = parseInt(req.params.job_id, 10);
    const qr_url = await generate_qr(job_id);
    res.send(qr_url); // we need this encoded and sent to front end
});


export  { qrRouter };