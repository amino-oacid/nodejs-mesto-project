import { Request, Response, NextFunction } from 'express';
import { CustomError, IError } from '../types';

const errorMiddleware = (error: IError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = error.statusCode || 400;
  console.log(error.statusCode);
  let message = error.message || 'Ошибка на сервере';

  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).send({ message });
};

export default errorMiddleware;
