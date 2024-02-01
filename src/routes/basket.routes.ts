import { Router } from "express";
import { AddToBasket, GetBasketCount, GetBasketProducts, RemoveFromBasket } from "../services/products";
import { Request, Response } from 'express';
import Auth from "../middleware/auth.middleware";

const basketRouter = Router();

basketRouter.get('/', Auth, async(req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (userId == null)
    {
      return res.status(400).json('Ошибка');
    }    
    const filteredProducts = await GetBasketProducts(userId);
    res.json(filteredProducts);          
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
})

basketRouter.get('/count', Auth, async(req: Request, res: Response) => {
  try {   
    const userId = req.params.userId;
    if (userId == null)
    {
      return res.status(400).json('Ошибка');
    }   
    const result = await GetBasketCount(userId);
    res.json(result);          
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
})

basketRouter.post('/add/:id', Auth, async (req: Request, res: Response) => {
    try {        
      const id = req.params.id;
      if (id == null)
      {
        return res.status(400).json('Ошибка');
      }
      const userId = req.params.userId;
      if (userId == null)
      {
        return res.status(400).json('Ошибка');
      }
      await AddToBasket(id, userId);
      res.status(200).json('Товар добален в корзину');          
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

  basketRouter.post('/delete/:id', Auth, async (req: Request, res: Response) => {
    try {        
      const id = req.params.id;
      if (id == null)
      {
        return res.status(400).json('Ошибка');
      }
      const userId = req.params.userId;
      if (userId == null)
      {
        return res.status(400).json('Ошибка');
      }
      await RemoveFromBasket(id);
      res.status(200).json('Товар удален из корзины');          
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

export default basketRouter;