import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { statusCodes } from '../custom-error';

const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      return res.status(statusCodes.badRequest).json({
        statusCode: statusCodes.badRequest,
        error: 'Bad Request',
        message: result.error.errors,
      });
    }

    next();
  };
};

export default validateRequest;
