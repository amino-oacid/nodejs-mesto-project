import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { statusCodes, CustomError } from '../custom-error';
import { AuthorizedRequest, JWT_SECRET } from '../config';
import updateUserMiddleware from '../middlewares/update-user';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(statusCodes.ok).send(users);
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw CustomError.NotFoundError();
    }

    return res.status(statusCodes.ok).send(user);
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw CustomError.NotFoundError();
    }

    return res.status(statusCodes.ok).send(user);
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    });

    return res.status(statusCodes.created).send(user);
  } catch (error: any) {
    if (error instanceof MongooseError.ValidationError) {
      return next(CustomError.BadRequest());
    }

    if (error.name === 'MongoError' && error.code === 11000) {
      return next(CustomError.BadRequest());
    }

    return next(error);
  }
};

export const loginUser = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    const maxAge = 3600000 * 24 * 7;

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      maxAge,
    });

    return res.status(statusCodes.ok).send({ message: 'Аутентификация пройдена' });
  } catch (error) {
    return next(error);
  }
};

export const updateUserProfile = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction,
) => {
  const updateUserInfo = true;
  updateUserMiddleware(req, res, next, updateUserInfo);
};

export const updateUserAvatar = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction,
) => {
  const updateUserInfo = false;
  updateUserMiddleware(req, res, next, updateUserInfo);
};
