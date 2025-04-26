import 'dotenv/config';

const crypto = require('crypto');

const secretKey = crypto.randomBytes(16).toString('hex');
const JWT_SECRET = process.env.JWT_SECRET || secretKey;

const defaultUser = {
  name: 'Жак-Ив Кусто',
  about: 'Исследователь',
  avatar: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

export { JWT_SECRET, defaultUser };
