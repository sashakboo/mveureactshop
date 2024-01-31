import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { ICategory, IOrder, IOrderState, IProduct, IUser } from "../models";
import { Loader } from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import Users from "../components/admin/Users";
import Products from "../components/admin/Products";
import Categories from "../components/admin/Categories";
import Orders from "../components/admin/Orders";

interface ITab {
  id: string, 
  title: string
}

interface ITabs {
  [id: string]: ITab
}

export default function AdminPage() {
  const tabs: ITabs = {
    'users': { id: 'users', title: 'Пользователи' },
    'products': { id: 'products', title: 'Товары' },
    'categories': { id: 'categories', title: 'Категории товаров' },
    'orders': { id: 'orders', title: 'Заказы' }
  }

  const [ users, setUsers ] = useState<Array<IUser>>([]);
  const [ products, setProducts ] = useState<Array<IProduct>>([]);
  const [ categories, setCategories ] = useState<Array<ICategory>>([]);
  const [ orders, setOrders ] = useState<Array<IOrder>>([]);
  const [ orderStates, setOrderStates ] = useState<Array<IOrderState>>([]);
  const [ activeTab, setActiveTab] = useState<ITab | null>(null);

  const { request, error, clearError, loading } = useHttp();
  const auth = useContext(AuthContext);

  useEffect(() => {
    async function getUsers() {
      const apiUrl = '/api/users';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedUsers = response as Array<IUser>;
      setUsers([...loadedUsers]);
      if (activeTab == null)
        setActiveTab(tabs['users'])
    }
    getUsers();
  }, []);

  useEffect(() => {
    async function getProducts() {
      const apiUrl = '/api/products/admin';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedProducts = response as Array<IProduct>;
      setProducts([...loadedProducts]);
    }
    getProducts();
  }, []);

  useEffect(() => {
    async function getCategories() {
      const apiUrl = '/api/categories';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedCategopries= response as Array<ICategory>;
      setCategories([...loadedCategopries]);
    }
    getCategories();
  }, []);

  useEffect(() => {
    async function getOrderStates() {
      const apiUrl = '/api/orders/states';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedOrderStates= response as Array<IOrderState>;
      setOrderStates([...loadedOrderStates]);
    }
    getOrderStates();
  }, []);

  useEffect(() => {
    async function getOrders() {
      const apiUrl = '/api/orders';
      const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
      const loadedOrders= response as Array<IOrder>;
      setOrders([...loadedOrders]);
    }
    getOrders();
  }, []);

  const updateUserHandler = (user: IUser) => {
    setUsers(users.map(u => {
      if (u.id === user.id)
        return user;

      return u;
    }));
  }
  const createCategoryHandler = (category: ICategory) => setCategories([category, ...categories])
  const updateCategoryHandler = (category: ICategory) => {
    setCategories(categories.map(p => {
      if (p.id === category?.id)
        return category;
      return p;
    }));
  }
  const updateOrderHandler = (order: IOrder) => {
    setOrders([...orders.map(o => {
      if (o.id === order.id)
        return order;
      return o;
    })]);
  }
  const createProductHandler = (product: IProduct) => setProducts([product, ...products])
  const updateProductHandler = (product: IProduct) => {
    setProducts(products.map(p => {
      if (p.id === product.id)
        return product;
      return p;
    }));
  }

  const tabsElement = Object.entries(tabs).map(([key, value]) => {
    return (
      <li className="nav-item" key={key}>
          <Link className={`nav-link ${key === activeTab?.id ? 'active' : ''}`} aria-current="page" to="" onClick={() => setActiveTab(value)}>{value.title}</Link>
      </li>
    )
  })

  const getAdminData = () => {
    if (activeTab?.id === tabs['users'].id){
      return <Users users={[...users]} updateUser={updateUserHandler}/>
    }
    if (activeTab?.id === tabs['products'].id){
      return <Products products={[...products]} categories={[...categories]} createProduct={createProductHandler} updateProduct={updateProductHandler}/>
    }
    if (activeTab?.id === tabs['categories'].id){
      return <Categories categories={[...categories]} createCategory={createCategoryHandler} updateCategory={updateCategoryHandler}/>
    }
    if (activeTab?.id === tabs['orders'].id){
      return <Orders orders={[...orders]} orderStates={[...orderStates]} updateOrder={updateOrderHandler} />
    }
  }

  return (
    <div className="container-fluid">
      <ul className="nav nav-tabs">
        {tabsElement}
      </ul>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} close={clearError}/>}
      {getAdminData()}
    </div>
  )
}