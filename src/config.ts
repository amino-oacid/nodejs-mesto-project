import 'dotenv/config';
import { Request } from 'express';

const crypto = require('crypto');

const secretKey = crypto.randomBytes(16).toString('hex');
const JWT_SECRET = process.env.JWT_SECRET || secretKey;

const defaultUser = {
  name: 'Жак-Ив Кусто',
  about: 'Исследователь',
  avatar: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

interface AuthorizedRequest extends Request {
  user?: {
    _id: string;
  };
}

export { JWT_SECRET, defaultUser, AuthorizedRequest };
