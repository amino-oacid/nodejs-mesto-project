import 'dotenv/config';
import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { AuthorizedRequest } from './types';

const { SERVER_PORT, DB_URL } = process.env;
if (!DB_URL) throw new Error('Ошибка, не найден url подключения к базе данных');
if (!SERVER_PORT) throw new Error('Ошибка, не найден порт');

mongoose.connect(DB_URL);

const app = express();
app.use(express.json());

// Временное решение авторизации - middleware добавляет в каждый запрос объект user
app.use((req: AuthorizedRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '680684602777f52fd39521f5', // кто бы ни создал карточку, в базе у неё будет один и тот же автор
  };

  next();
});

app.use(usersRouter);
app.use(cardsRouter);

app.listen(SERVER_PORT, () => {
  console.log(`app listening on PORT ${SERVER_PORT}`);
  console.log(`app connecting to db ${DB_URL}`);
});
