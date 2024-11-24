import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  
import connect from './db/db'; 
import convertCurrencyRouter from './routes/convertCurrencyRoute';

dotenv.config();

const app = express();


app.use(cors());  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect();

app.use('/api', convertCurrencyRouter);

app.listen(7000, () => {
  console.log('Backend Server is Running on port 7000');
});
