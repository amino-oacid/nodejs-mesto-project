import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { errorMessages, statusCodes } from '../custom-error';
import { JWT_SECRET } from '../config';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (authorization: string) => authorization.replace('Bearer ', '');

const authMiddleware = async (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(statusCodes.unauthorized).send({ message: errorMessages.unauthorizedError });
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(statusCodes.unauthorized).send({ message: errorMessages.unauthorizedError });
  }

  req.user = payload;

  next();
};

export default authMiddleware;
