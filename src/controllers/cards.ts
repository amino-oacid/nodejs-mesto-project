import { Request, Response } from 'express';
import { Error as MongooseError, Schema } from 'mongoose';
import Card from '../models/card';
import { AuthorizedRequest, statusCodes, errorMessages } from '../types';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(statusCodes.ok).send(cards);
  } catch {
    return res
      .status(statusCodes.internalServerError)
      .send({ message: errorMessages.internalServerError });
  }
};

export const createCard = async (req: AuthorizedRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  try {
    const card = await Card.create({ name, link, owner });

    return res.status(statusCodes.created).send(card);
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

export const deleteCard = async (req: AuthorizedRequest, res: Response) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(statusCodes.notFound).send({ message: errorMessages.notFoundError });
    }

    if (card?.owner.toString() !== req.user?._id) {
      return res.status(statusCodes.badRequest).send({ message: 'Вы не можете удалить карточку другого пользователя' });
    }

    const cardToDelete = await card?.deleteOne();

    return res.status(statusCodes.ok).send(cardToDelete);
  } catch {
    return res
      .status(statusCodes.internalServerError)
      .send({ message: errorMessages.internalServerError });
  }
};

export const likeCard = async (req: AuthorizedRequest, res: Response) => {
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
      return res.status(statusCodes.notFound).send({ message: errorMessages.notFoundError });
    }

    return res.status(statusCodes.ok).send(likedCard);
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

export const dislikeCard = async (req: AuthorizedRequest, res: Response) => {
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
      return res.status(statusCodes.notFound).send({ message: errorMessages.notFoundError });
    }

    return res.status(statusCodes.ok).send(dislikedCard);
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
