import { useState, useContext, useEffect } from "react";
import { EditableTable, IEditableTableProps, InputTypes } from "../../components/EditableTable";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { IOrder, IOrderState, IUpdateOrderState } from "../../models";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";

export interface IOrdersProps {
  orders: Array<IOrder>,
  orderStates: Array<IOrderState>,
  updateOrder: (order: IOrder) => void
}

export default function Orders(props: IOrdersProps) {
  const [ orders, setOrders ] = useState<Array<IOrder>>([...props.orders]);
  const { request, error, clearError, loading } = useHttp();
  const auth = useContext(AuthContext);
  
  const updateOrderState = async (order: IUpdateOrderState) => {
    const updatedOrder = await request('/api/orders/changestate', 'POST', JSON.stringify(order), { Authorization: `Bearer ${auth.token}` });
    setOrders([...orders.map(o => {
      if (o.id == updatedOrder.id)
        return updatedOrder
      return o;
    })]);
    props.updateOrder(updatedOrder);
  }

  const stateSelectItems = props.orderStates.map(c => ({ id: c.id, title: c.title }));
  const tableProps: IEditableTableProps = {
    columnsIds: [ 'id', 'created', 'customerEmail', 'state', 'itemsCount', 'totalCost' ],
    columnsTitle: [ 'ID', 'Создано', 'Email', 'Состояние', 'Кол-во позиций', 'Сумма' ],
    inputTypes: [ null, null, null, InputTypes.select, null, null ],
    selectItems: [ null, null, null, stateSelectItems, null, null ],
    values: orders.map((p) => {
      return [ p.id, new Date(p.created).toLocaleDateString(), p.customerEmail, p.state, p.itemsCount, p.totalCost]
    }),
    sourceObjs: [ ...orders ],
    canAddNew: false,
    updateItem: async (sourceObj, form) => {
      const order = sourceObj as IOrder;
      const updatedOrderState = {
        orderId: order.id,
        state: form.get('state') as number
      }
      await updateOrderState(updatedOrderState);
    },
    addNewItem: () => {}
  } 

  return (
    <div className="container">
      { error != null && <ErrorMessage message={error} close={clearError}/> }
      {loading && <Loader />}
        <EditableTable {...tableProps}/>
    </div>
  )
}