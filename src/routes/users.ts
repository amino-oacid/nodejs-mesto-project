import { Router } from 'express';
import { getUsers, getUser, createUser } from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUser);
usersRouter.post('/users', createUser);

export default usersRouter;
