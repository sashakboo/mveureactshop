import { ICreatedOrder, IOrder, IOrderState, IUpdateOrderState } from "../models";
import { Basket, Order, User } from "../mongodb/models";

export async function GetAllOrders(): Promise<Array<IOrder>> {
  var orders = await Order.find({});
  return orders.map(e => {
    return {
      created: e.created,
      customerEmail: e.customerEmail,
      id: e.id,
      itemsCount: e.itemsCount,
      totalCost: e.totalCost,
      state: e.state
    } as IOrder;
  });
}

export async function GetOrder(id: string): Promise<IOrder> {
  const order = await Order.findById(id);
  return {
    created: order.created,
    customerEmail: order.customerEmail,
    id: order.id,
    itemsCount: order.itemsCount,
    totalCost: order.totalCost,
    state: order.state
  } as IOrder;
}

export async function GetOrderStates(): Promise<Array<IOrderState>> {
  return [
    {
      id: 'created',
      name: 'created',
      title: 'Создано'
    },
    {
      id: 'done',
      name: 'done',
      title: 'Выполнено'
    }
  ];
}

export async function SetOrderState(order: IUpdateOrderState) {
  const updatedOrder = await Order.findByIdAndUpdate(order.orderId, {
    state: order.state
  });
  await updatedOrder.save();
}

export async function CreateOrder(userId: string, createdOrder: ICreatedOrder): Promise<number> {
  var customer = await User.findById(userId);
  const order = await Order.create({
    created: new Date(),
    customerEmail: customer.email,
    itemsCount: createdOrder.products.length,
    totalCost: createdOrder.products.map(e => e.orderPrice).reduce((acc, e) => {
      return acc + e;
    }, 0),
    state: 'created'
  });

  await order.save();

  await Promise.all(createdOrder.products.map(async e => {
    await Basket.findByIdAndDelete(e.basketItemId);
  }));

  return order.id;  
}