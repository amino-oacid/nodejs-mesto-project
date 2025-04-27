import { Response, NextFunction } from 'express';
import { Error as MongooseError, Schema } from 'mongoose';
import { AuthorizedRequest } from '../config';
import Card from '../models/card';
import { statusCodes, CustomError } from '../custom-error';

const updateLikeCardMiddleware = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction,
  putLikeCard: boolean,
) => {
  const { cardId } = req.params;
  const userId = req.user?._id as Schema.Types.ObjectId | undefined;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      putLikeCard
        ? {
          $addToSet: // добавить _id в массив, если его там нет
            {
              likes: userId,
            },
        }
        : {
          $pull: // убрать _id из массива
            {
              likes: userId,
            },
        },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCard) {
      throw CustomError.NotFoundError();
    }

    return res.status(statusCodes.ok).send(updatedCard);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(CustomError.BadRequest());
    }

    return next(error);
  }
};

export default updateLikeCardMiddleware;
