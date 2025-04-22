import { model, Schema } from 'mongoose';

export type TUser = {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<TUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
}, { versionKey: false });

export default model<TUser>('User', userSchema);
