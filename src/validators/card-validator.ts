import { z } from 'zod';

export const validateCreateCardSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(30),
    link: z.string().url(),
  }),
});

export const validateCardIdSchema = z.object({
  params: z.object({
    cardId: z
      .string()
      .length(24)
      .regex(/^[a-f0-9]+$/),
  }),
});
