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

export interface IError extends Error {
  statusCode?: number;
}

export class CustomError extends Error implements IError {
  public statusCode: number;

  constructor(status: number, message: string) {
    super(message);
    this.statusCode = status;
  }

  static NotFoundError() {
    return new CustomError(statusCodes.notFound, errorMessages.notFoundError);
  }

  static Unauthorized() {
    return new CustomError(statusCodes.unauthorized, errorMessages.unauthorizedError);
  }

  static BadRequest() {
    return new CustomError(statusCodes.badRequest, errorMessages.badRequestError);
  }

  static InternalError() {
    return new CustomError(statusCodes.internalServerError, errorMessages.internalServerError);
  }
}
