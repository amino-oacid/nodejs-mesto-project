import 'dotenv/config';
import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import { AuthorizedRequest } from './types';
import router from './routes/index';

const { SERVER_PORT, DB_URL } = process.env;
if (!DB_URL) throw new Error('Ошибка, не найден url подключения к базе данных');
if (!SERVER_PORT) throw new Error('Ошибка, не найден порт');

const app = express();
app.use(express.json());

// Временное решение авторизации - middleware добавляет в каждый запрос объект user
app.use((req: AuthorizedRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '680684602777f52fd39521f5', // кто бы ни создал карточку, в базе у неё будет один и тот же автор
  };

  next();
});

app.use(router);

mongoose.connect(DB_URL)
  .then(() => {
    app.listen(SERVER_PORT);
  })
  .catch((error) => {
    console.log(error);
  });
