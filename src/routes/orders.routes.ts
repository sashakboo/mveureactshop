import { Router } from "express";
import { CreateOrder, GetAllOrders, GetOrder, GetOrderStates, SetOrderState } from "../services/orders";
import { Request, Response } from 'express';
import Auth from "../middleware/auth.middleware";
import { ICreatedOrder, IUpdateOrderState } from "../models";

const orderRouter = Router();

interface ISetOrderStateRequest extends Request {
  body: IUpdateOrderState
}

interface ICreateOrderRequest extends Request {
  body: ICreatedOrder
}


orderRouter.get('/', Auth, async(req: Request, res: Response) => {
  try {   
    const orders = await GetAllOrders();
    res.json(orders);          
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

orderRouter.get('/states', Auth, async (req: Request, res: Response) => {
  try {   
    const orderStates = await GetOrderStates();
    res.json(orderStates);          
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

orderRouter.post('/create', Auth, async(req: ICreateOrderRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (Number.isNaN(userId))
    {
      res.status(400);
    }
    const createdOrder = req.body as ICreatedOrder;
    const orderId = await CreateOrder(userId, createdOrder);
    res.json(orderId);          
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

orderRouter.post('/changestate', Auth, async(req: ISetOrderStateRequest, res: Response) => {
  try {
    const orderState = req.body;
    await SetOrderState(orderState);
    const updatedOrder = await GetOrder(orderState.orderId);
    res.json(updatedOrder);       
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});


export default orderRouter;