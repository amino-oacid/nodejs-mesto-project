import { z } from 'zod';

export const validateUserIdSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .length(24),
  }),
});

export const validateLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const validateCreateUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(30)
      .optional(),
    about: z
      .string()
      .min(2)
      .max(200)
      .optional(),
    avatar: z.string().url().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const validateUpdateUserProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(30)
      .optional(),
    about: z
      .string()
      .min(2)
      .max(200)
      .optional(),
  }),
});

export const validateUpdateAvatarSchema = z.object({
  body: z.object({
    avatar: z.string().url(),
  }),
});
