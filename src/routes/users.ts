import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUserInfo,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.get('/me', getCurrentUserInfo);
// usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserProfile);
usersRouter.patch('/me/avatar', updateUserAvatar);

export default usersRouter;
