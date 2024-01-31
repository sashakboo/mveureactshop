import { Router } from "express";
import bcrypt from 'bcryptjs';
import { GetUser, GetUsers, UpdateUser } from "../services/users";
import { Request, Response } from 'express';
import Auth from "../middleware/auth.middleware";
import { check, validationResult } from "express-validator";
import { IUser } from "../models";

interface IUserRequest extends Request {
  body: IUser
}

const usersRouter = Router();

usersRouter.get('/', Auth, async(req: Request, res: Response) => {
  try {  
    const users = await GetUsers();
    res.json(users);          
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
})

usersRouter.post('/update', 
  [ Auth, check('password', 'Минимальная длина пароля 5 символов').isLength({ min: 5 }), check('role', 'Роль должна быть одним из значений: admin, user').isIn(['admin', 'user'])], 
   async (req: IUserRequest, res: Response) => {

    try {    
      const errors = validationResult(req);        
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(),
          message: 'Некорректные данные: ' + errors.array().reduce((acc, v) => acc + v.msg + ', ', '')
        });
      }     
      
      const { id, password, role, active } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      await UpdateUser(id, hashedPassword, role, active);
      const user = await GetUser(id);
      res.json(user);          
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

export default usersRouter;