import {
  Router, Request, Response, NextFunction,
} from 'express';
import userRouter from './users';
import cardRouter from './cards';
import auth from '../middlewares/auth';
import NotFoundError from '../errors/not-found-error';
import {
  createUser, login,
} from '../controllers/users';
import { validateUserBody, validateAuthentication } from '../middlewares/validatons';

const fs = require('fs');
const pm2 = require('pm2');

const router = Router();
router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuthentication, login);
// crash-test.
router.get('/crash-test', (Request, Response) => {
  fs.writeFile('testFile.txt', 'Response', (err: any) => {
    if (err) throw err;
    console.log('File created');
  });
  Response.send("Crash test");
  pm2.stop;
});

// все роуты, кроме /signin и /signup, защищены авторизацией;
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
