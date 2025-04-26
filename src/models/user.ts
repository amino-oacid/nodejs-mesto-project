import mongoose, { model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { errorMessages } from '../custom-error';
import { defaultUser } from '../config';

export type TUser = {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
};

interface UserModel extends mongoose.Model<TUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, TUser>>;
}

const userSchema = new Schema<TUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultUser.name,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: defaultUser.about,
  },
  avatar: {
    type: String,
    default: defaultUser.avatar,
    validate: {
      validator(avatar: string) {
        const regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        return regexp.test(avatar);
      },
      message: 'Некорректный формат ссылки на аватар',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, { versionKey: false });

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return new Error(errorMessages.unauthorizedError);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return new Error(errorMessages.unauthorizedError);
          }

          return user;
        });
    });
});

export default model<TUser, UserModel>('User', userSchema);
