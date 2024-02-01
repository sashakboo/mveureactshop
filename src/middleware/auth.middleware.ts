import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction} from 'express';
import config from 'config';
import { GetUser } from '../services/users';

export default async function Auth (req: Request<{ userId: string}>, res: Response, next: NextFunction): Promise<void> {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers?.authorization?.split(' ')[1];  // "Bearer TOKEN"
    if (!token) {
      res.status(401).json({ message: 'Не авторизован' });   
      return; 
    }

    const decoded: any = jwt.verify(token, config.get('jwtSecret'));
    req.params.userId = decoded.userId as string;

    var  user = await GetUser(req.params.userId);
    if (user == null)
    {
      throw new Error('Пользователь не существует');
    }

    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: 'Не авторизован' });          
  }
}