import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError, Schema } from 'mongoose';
import Card from '../models/card';
import { statusCodes, CustomError } from '../custom-error';
import { AuthorizedRequest } from '../config';
import updateLikeCardMiddleware from '../middlewares/update-like-card';

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
  const putLikeCard = true;
  updateLikeCardMiddleware(req, res, next, putLikeCard);
};

export const dislikeCard = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const putLikeCard = false;
  updateLikeCardMiddleware(req, res, next, putLikeCard);
};
