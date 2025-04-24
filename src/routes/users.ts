import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserProfile);
usersRouter.patch('/me/avatar', updateUserAvatar);

export default usersRouter;
