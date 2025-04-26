import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { createUser, loginUser } from './controllers/users';
import authMiddleware from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorMiddleware from './middlewares/errors';

const { SERVER_PORT, DB_URL } = process.env;

if (!DB_URL) throw new Error('Ошибка, не найден url подключения к базе данных');
if (!SERVER_PORT) throw new Error('Ошибка, не найден порт');

const app = express();
app.use(express.json());

app.use(requestLogger);

app.post('/signin', loginUser);
app.post('/signup', createUser);
app.use(authMiddleware);
app.use('/', router);

app.use(errorLogger);

app.use(errorMiddleware);

mongoose.connect(DB_URL)
  .then(() => {
    app.listen(SERVER_PORT);
    console.log(`connecting to ${SERVER_PORT}`);
    console.log(`connecting to ${DB_URL}`);
  })
  .catch((error) => {
    console.log(error);
  });
