import get_qr_data_url from '../qr_generation.js';
import express from 'express';
var qrRouter = express.Router();

qrRouter.get('/url/:url', async function(req, res, next) {
    let urls = req.params["url"];
    const qr_url = await get_qr_data_url(`${urls}`);
    res.render('qr', { data_url: `${qr_url}` });
});


export  { qrRouter };