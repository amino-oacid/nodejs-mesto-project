import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} from '../controllers/users';
import validateRequest from '../middlewares/validate-request';
import { validateUpdateAvatarSchema, validateUpdateUserProfileSchema, validateUserIdSchema } from '../validators/user-validator';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', validateRequest(validateUpdateUserProfileSchema), updateUserProfile);
usersRouter.patch('/me/avatar', validateRequest(validateUpdateAvatarSchema), updateUserAvatar);
usersRouter.get('/:userId', validateRequest(validateUserIdSchema), getUser);

export default usersRouter;
