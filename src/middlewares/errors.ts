import { Request, Response, NextFunction } from 'express';
import {
  CustomError,
  errorMessages,
  IError,
  statusCodes,
} from '../custom-error';

const errorsMiddleware = (error: IError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = error.statusCode || statusCodes.internalServerError;
  let message = error.message || errorMessages.internalServerError;

  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).send({ message });
};

export default errorsMiddleware;
