import express from "express";
import cors from 'cors';
import http from 'http';
import bodyParser from "body-parser";
import dotenv from 'dotenv';

dotenv.config()

import { db } from './connection';
import {globalErrorHandler} from './utils/globalErrorHandler';

import bookingRouter from './routes/booking';

const app = express();

app.use(cors())
app.use(function (req: any, res: any, next: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,content-type'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.use(bodyParser.json())

app.use('/v1/api', bookingRouter);
app.use('**', (req: any, res: any)=> {
  res.status(404).json({
    status: 'ERROR',
    message: "Route Not Found"
  })
})

const server = http.createServer(app);
app.use(globalErrorHandler);

server.listen(process.env.PORT ?? 3000, async ()=> {
  await db()
  console.log(`server is listening to port ${process.env.PORT ?? 3000}`)    
});


export default app;
