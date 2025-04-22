import { Request } from 'express';

export const statusCodes = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  internalServerError: 500,
};

export const errorMessages = {
  badRequestError: 'Запрос составлен неправильно',
  unauthorizedError: 'Пользователь не авторизован',
  notFoundError: 'Запрашиваемый ресурс не найден',
  internalServerError: 'Ошибка на сервере',
};

export interface AuthorizedRequest extends Request {
  user?: {
    _id: string;
  };
}
