import { executeCommand } from "../database/database";
import { ICreatedOrder, IOrder, IOrderState, IUpdateOrderState } from "../models";
import { RemoveFromBasket } from "./products";

const orderStates: Array<IOrderState> = [];

export async function GetAllOrders(): Promise<Array<IOrder>> {
  const commandText = 'select o.id, o.created, u.email customeremail, os.title as state, count(i.id) as itemscount, sum(i.orderprice) as totalcost ' +
    'from public.orders o ' +
    'inner join public.users u on u.id = o.customer ' +  
    'inner join public.orderstates os on os.id = o.state ' +
    'inner join public.orderitems i on i.orderid = o.id ' +
    'group by o.id, o.created, u.email, os.title ' +
    'order by o.created desc, o.state, o.id'  

  const result = await executeCommand(commandText, []);
  const orders: Array<IOrder> = result.rows.map(r => {
    return {
      id: parseInt(r['id']),
      created: new Date(r['created']),
      state: r['state'],
      customerEmail: r['customeremail'],
      itemsCount: parseInt(r['itemscount']),
      totalCost: parseFloat(r['totalcost']),
    }
  });
  return orders;
}

export async function GetOrder(id: number): Promise<IOrder> {
  const commandText = 'select o.id, o.created, u.email customeremail, os.title as state, count(i.id) as itemscount, sum(i.orderprice) as totalcost ' +
    'from public.orders o ' +
    'inner join public.users u on u.id = o.customer ' +  
    'inner join public.orderstates os on os.id = o.state ' +
    'inner join public.orderitems i on i.orderid = o.id ' +
    'where o.id = $1::int ' +
    'group by o.id, o.created, u.email, os.title ' +
    'order by o.created, o.state, o.id'  

  const result = await executeCommand(commandText, [ id ]);
  const r = result.rows[0];
  return {
    id: parseInt(r['id']),
    created: new Date(r['created']),
    state: r['state'],
    customerEmail: r['customeremail'],
    itemsCount: parseInt(r['itemscount']),
    totalCost: parseFloat(r['totalcost']),
  }
}

export async function GetOrderStates(): Promise<Array<IOrderState>> {
  const commandText = 'select id, name, title from public.orderstates';
  const results = await executeCommand(commandText, []);
  return results.rows.map(r => {
    return {
      id: parseInt(r['id']),
      name: r['name'],
      title: r['title']
    }
  });
}

export async function SetOrderState(order: IUpdateOrderState) {
  const commandText = 'update public.orders set state = $1::int where id = $2::int';
  await executeCommand(commandText, [ order.state, order.orderId ]);
}

export async function CreateOrder(userId:number, createdOrder: ICreatedOrder): Promise<number> {
  const state = await getOrderStateByName('created');
  const commandText = 'insert into public.orders(customer, state) values ($1::int, $2::int) RETURNING id;';
  const results = await executeCommand(commandText, [ userId, state.id ]);
  if (results.rowCount === 1){
    const orderId = parseInt(results.rows[0]['id']);
    await CreateOrderItems(orderId, createdOrder);

    return orderId;
  }

  throw new Error('Cannot create order');
}

async function CreateOrderItems(orderId: number, createdOrder: ICreatedOrder) {
  if (createdOrder.products.length <= 0){
    return;
  }
  const commandText = 'insert into public.orderitems(orderid, product, orderPrice) values ($1::int, $2::int, $3::numeric);';
  const orderProducts = [...createdOrder.products];
  const promises: Array<Promise<any>> = [];
  orderProducts.forEach(async (p) => {
    promises.push(executeCommand(commandText, [ orderId, p.id, p.orderPrice ]));
    promises.push(RemoveFromBasket(p.basketItemId));
  });

  await Promise.all(promises);
}

async function getOrderStateByName(name: string): Promise<IOrderState> {
  let orderState = orderStates.find(x => x.name === name);
  if (orderState == null){
    const results = await executeCommand('select id, title from public.orderstates where lower(name) = lower($1::string)', [ name ]);
    if (results.rowCount === 1){
      orderState = {
        id: parseInt(results.rows[0]['id']),
        name: results.rows[0]['name'],
        title: results.rows[0]['title']
      };
      orderStates.push(orderState);
    }
  }
  if (orderState != null)
    return orderState;
    
  throw new Error(`Order state '${name}' not found`);
}