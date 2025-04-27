import { Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { AuthorizedRequest } from '../config';
import User from '../models/user';
import { statusCodes, CustomError } from '../custom-error';

const updateUserMiddleware = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction,
  updateUserInfo: boolean,
) => {
  const { name, about, avatar } = req.body;
  const userId = req.user?._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateUserInfo
        ? { name, about }
        : { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!updatedUser) {
      throw CustomError.NotFoundError();
    }

    return res.status(statusCodes.ok).send(updatedUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(CustomError.BadRequest());
    }

    return next(error);
  }
};

export default updateUserMiddleware;
