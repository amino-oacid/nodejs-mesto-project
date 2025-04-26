import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError, Schema } from 'mongoose';
import Card from '../models/card';
import { statusCodes, CustomError } from '../types';
import { AuthorizedRequest } from '../config';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.status(statusCodes.ok).send(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  try {
    const card = await Card.create({ name, link, owner });

    return res.status(statusCodes.created).send(card);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(CustomError.BadRequest());
    }

    return next(error);
  }
};

export const deleteCard = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw CustomError.NotFoundError();
    }

    if (card?.owner.toString() !== req.user?._id) {
      throw CustomError.BadRequest();
    }

    const cardToDelete = await card?.deleteOne();

    return res.status(statusCodes.ok).send(cardToDelete);
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  try {
    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $addToSet:
          {
            likes: userId,
          },
      }, // добавить _id в массив, если его там нет
      {
        new: true,
        runValidators: true,
      },
    );

    if (!likedCard) {
      throw CustomError.NotFoundError();
    }

    return res.status(statusCodes.ok).send(likedCard);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(CustomError.BadRequest());
    }

    return next(error);
  }
};

export const dislikeCard = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id as Schema.Types.ObjectId | undefined;

  try {
    const dislikedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $pull:
          {
            likes: userId,
          },
      }, // убрать _id из массива
      {
        new: true,
        runValidators: true,
      },
    );

    if (!dislikedCard) {
      throw CustomError.NotFoundError();
    }

    return res.status(statusCodes.ok).send(dislikedCard);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(CustomError.BadRequest());
    }

    return next(error);
  }
};
