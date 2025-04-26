import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
// import { AuthorizedRequest } from './types';
import router from './routes/index';
import { createUser, loginUser } from './controllers/users';
import authMiddleware from './middlewares/auth';

const { SERVER_PORT, DB_URL } = process.env;

if (!DB_URL) throw new Error('Ошибка, не найден url подключения к базе данных');
if (!SERVER_PORT) throw new Error('Ошибка, не найден порт');

const app = express();
app.use(express.json());

/*
// Временное решение авторизации - middleware добавляет в каждый запрос объект user
app.use((req: AuthorizedRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '680684602777f52fd39521f5', // кто бы ни создал карточку, в базе у неё будет один автор
  };

  next();
});
*/

app.post('/signin', loginUser);
app.post('/signup', createUser);
app.use(authMiddleware);
app.use('/', router);

mongoose.connect(DB_URL)
  .then(() => {
    app.listen(SERVER_PORT);
    console.log(`connecting to ${SERVER_PORT}`);
    console.log(`connecting to ${DB_URL}`);
  })
  .catch((error) => {
    console.log(error);
  });
