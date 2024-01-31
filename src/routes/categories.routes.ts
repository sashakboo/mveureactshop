import { Router } from "express";
import { CreateCategory, GetCategories, UpdateCategory } from "../services/products";
import { Request, Response } from 'express';
import Auth from "../middleware/auth.middleware";
import { ICategory } from "../models";

interface ICategoryRequest extends Request {
  body: ICategory
}

const categoriesRouter = Router();

categoriesRouter.get('/active', Auth, async (req: Request, res: Response) => {
  try {        
     const categories = await GetCategories(true);
     res.json(categories);          
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
 })

categoriesRouter.get('/', Auth, async (req: Request, res: Response) => {
 try {        
    const categories = await GetCategories(false);
    res.json(categories);          
 } catch (e) {
   console.error(e);
   res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
 }
})

categoriesRouter.post('/update', Auth, async (req: ICategoryRequest, res: Response) => {
  try {        
     const category = req.body;
     const updatedCategory = await UpdateCategory(category);
     res.json(updatedCategory);          
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
 })


categoriesRouter.post('/create/:title', Auth, async (req: Request, res: Response) => {
  try {        
     const categoryName = req.params.title;
     const category = await CreateCategory(categoryName);
     res.json(category);          
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
 })

export default categoriesRouter;