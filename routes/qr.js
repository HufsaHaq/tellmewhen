import { generate_qr, decryptJobId } from '../qr_generation.js';

import express from 'express';

let qrRouter = express.Router();

qrRouter.get('/jobs/:job_id', async function(req, res, next) {
    const job_id = req.params.job_id;
    const qr_url = await generate_qr(job_id);
    res.send(qr_url);
});


export  { qrRouter };

