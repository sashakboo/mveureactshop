import { Router } from "express";
import { AddToBasket, GetBasketCount, GetBasketProducts, RemoveFromBasket } from "../services/products";
import { Request, Response } from 'express';
import Auth from "../middleware/auth.middleware";

const basketRouter = Router();

basketRouter.get('/', Auth, async(req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (Number.isNaN(userId))
    {
      res.status(400);
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
    const userId = parseInt(req.params.userId);
    if (Number.isNaN(userId))
    {
      res.status(400);
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
      const id: number = parseInt(req.params.id);
      if (Number.isNaN(id))
      {
        res.status(400);
      }
      const userId = parseInt(req.params.userId);
      if (Number.isNaN(userId))
      {
        res.status(400);
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
      const id: number = parseInt(req.params.id);
      if (Number.isNaN(id))
      {
        res.status(400);
      }
      const userId = parseInt(req.params.userId);
      if (Number.isNaN(userId))
      {
        res.status(400);
      }
      await RemoveFromBasket(id);
      res.status(200).json('Товар удален из корзины');          
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
  });

export default basketRouter;