import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from "cors";
import {indexRouter} from "./routes/index.js";
import {qrRouter} from './routes/qr.js';
import {deletionRouter} from './routes/delRoutes.js';

dotenv.config();

var app = express();
const __dirname = import.meta.dirname;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // do we need a view engine

app.use(logger('dev'));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/qr', qrRouter);
app.use('/delete', deletionRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT, ()=>{
  console.log(`Server listening on http://localhost:${process.env.PORT}`)
})
// export { app };
