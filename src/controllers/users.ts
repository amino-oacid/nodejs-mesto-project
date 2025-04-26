import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { statusCodes, errorMessages, AuthorizedRequest } from '../types';
import { JWT_SECRET } from '../config';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(statusCodes.ok).send(users);
  } catch {
    return res
      .status(statusCodes.internalServerError)
      .send({ message: errorMessages.internalServerError });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(statusCodes.notFound).send({ message: errorMessages.notFoundError });
    }

    return res.status(statusCodes.ok).send(user);
  } catch {
    return res
      .status(statusCodes.internalServerError)
      .send({ message: errorMessages.internalServerError });
  }
};

export const getCurrentUserInfo = async (req: AuthorizedRequest, res: Response) => {
  const userId = req.user?._id;
  console.log(`getCurrentUserInfo ${userId}`);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(statusCodes.notFound).send({ message: errorMessages.notFoundError });
    }

    return res.status(statusCodes.ok).send(user);
  } catch {
    return res
      .status(statusCodes.internalServerError)
      .send({ message: errorMessages.internalServerError });
  }
};

export const createUser = async (req: Request, res: Response) => {
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
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return res
        .status(statusCodes.badRequest)
        .send({ message: errorMessages.badRequestError + error.message });
    }

    return res
      .status(statusCodes.internalServerError)
      .send({ message: errorMessages.internalServerError });
  }
};

export const loginUser = async (req: AuthorizedRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    return res.send({
      token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
    });
  } catch (error) {
    return res.status(statusCodes.unauthorized).send({ message: errorMessages.unauthorizedError });
  }
};

export const updateUserProfile = async (req: AuthorizedRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!updatedUser) {
      return res.status(statusCodes.notFound).send({ message: errorMessages.notFoundError });
    }

    return res.status(statusCodes.ok).send(updatedUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return res
        .status(statusCodes.badRequest)
        .send({ message: errorMessages.badRequestError + error.message });
    }

    return res
      .status(statusCodes.internalServerError)
      .send({ message: errorMessages.internalServerError });
  }
};

export const updateUserAvatar = async (req: AuthorizedRequest, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!updatedUser) {
      return res.status(statusCodes.notFound).send({ message: errorMessages.notFoundError });
    }

    return res.status(statusCodes.ok).send(updatedUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return res
        .status(statusCodes.badRequest)
        .send({ message: errorMessages.badRequestError + error.message });
    }

    return res
      .status(statusCodes.internalServerError)
      .send({ message: errorMessages.internalServerError });
  }
};
