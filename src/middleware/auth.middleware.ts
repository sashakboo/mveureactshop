import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction} from 'express';
import config from 'config';

export default function Auth (req: Request<{ userId: string}>, res: Response, next: NextFunction): void {
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
    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: 'Не авторизован' });          
  }
}