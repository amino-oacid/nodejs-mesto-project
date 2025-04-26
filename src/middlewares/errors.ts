import { Request, Response, NextFunction } from 'express';
import { CustomError, IError } from '../custom-error';

const errorsMiddleware = (error: IError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = error.statusCode || 400;
  let message = error.message || 'Ошибка на сервере';

  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).send({ message });
};

export default errorsMiddleware;
