import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { errorMessages, statusCodes } from '../types';
import { JWT_SECRET } from '../config';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (authorization: string) => authorization.replace('Bearer ', '');

const authMiddleware = async (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.body;

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
  console.log(req.user);

  next();
};

export default authMiddleware;
