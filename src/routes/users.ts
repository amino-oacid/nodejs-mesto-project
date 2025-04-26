import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  getMem,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.get('/me', getMem);
usersRouter.patch('/me', updateUserProfile);
usersRouter.patch('/me/avatar', updateUserAvatar);

export default usersRouter;
