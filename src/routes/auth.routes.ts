import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { CreateUser, GetUserByEmail, GetUserRole } from '../services/users';
import Auth from '../middleware/auth.middleware';

interface ILoginBody {
    email: string;
    password: string;
}
  
interface ILoginRequest extends Request {
    body: ILoginBody;
}

const authRouter = Router();

// /api/auth/register
authRouter.post(
    '/register',
    [
      check('email', 'Некорректный email').isEmail(),
      check('password', 'Минимальная длина пароля 5 символов').isLength({ min: 5 })
    ],
    async (req: ILoginRequest, res: Response) => {
      try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            errors: errors.array(),
            message: 'Некорректные данные: ' + errors.array().reduce((acc, v) => acc + v.msg + ', ', '')
           });
        }      
  
        const { email, password } = req.body;  
        const candidate = await GetUserByEmail(email);
  
        if (candidate) {
          return res.status(400).json({ message: 'Такой пользователь уже существует' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await CreateUser(email, hashedPassword);
        if (!user) {
          return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const token = jwt.sign(
          { userId: user.id },
          config.get('jwtSecret'),
          { expiresIn: '1h' }
        );
  
        res.status(200).json({ token, userId: user.id });      
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
      }
    }
  );

// /api/auth/login
authRouter.post(
  '/login', 
  [
    check('email', 'Введите email').exists(),
    check('password', 'Введите пароль').exists()
  ],
  async (req: ILoginRequest, res: Response) => {
    try {
      const errors = validationResult(req);  

      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему'
         });
      }

      const { email, password } = req.body;
      const user = await GetUserByEmail(email);

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      if (!user.active) {
        return res.status(400).json({ message: 'Пользователь отключен' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      );

      res.status(200).json({ token, userId: user.id });
             
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  }
);

authRouter.get('/role/:id', Auth, async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    if (Number.isNaN(id))
    {
      res.status(400);
    }
    const role = await GetUserRole(id);
    res.json({ role })
});

export default authRouter;