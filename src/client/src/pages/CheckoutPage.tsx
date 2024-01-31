import { useContext, useEffect, useState } from 'react';
import { useHttp } from "../hooks/http.hook"
import { IBasketProduct, ICreatedOrder } from "../models";
import { AuthContext } from '../context/AuthContext';
import { NotifyContext } from '../context/NotifyContext';
import { Link } from 'react-router-dom';
import { Loader } from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function CheckoutPage() {
    const [ hasItems, setHasItems ] = useState(false);
    const [ basketItems, setBasketItems ] = useState<Array<IBasketProduct>>([]);
    const [ orderDone, setOrderDone ] = useState(false);
    const [ form, setForm ] = useState<Map<string, any>>(new Map());
    const [ formError, setFormError ] = useState<Array<string>>([])
    const changeHandler = (event: React.FormEvent<HTMLSelectElement | HTMLInputElement>) => {
        if (event.currentTarget == null){
        return;
        }
        const key = event.currentTarget.name;
        const value = event.currentTarget.value;
        setForm((previousForm) => previousForm.set(key, value));
    }

    const { loading, request } = useHttp();
    const auth = useContext(AuthContext);

    const fetchProducts = async () => {
        try {
            const apiUrl = `/api/basket`;
            const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
            const data = response as Array<IBasketProduct>;
            setBasketItems(data);
            setHasItems(data.length > 0);    
        } catch (e) { }
      }

    useEffect(() => {
        fetchProducts();
    }, []);

    const { changeBasketCount, resetBasketCount } = useContext(NotifyContext);

    const removeFromBasket = async (product: IBasketProduct) => {
        try {
            changeBasketCount(-1); 
            const apiUrl = `/api/basket/delete/${product.id}`;
            await request(apiUrl, 'POST', null, { Authorization: `Bearer ${auth.token}` });  
            setBasketItems(basketItems.filter(x => x.id !== product.id));
        } catch (e) { }
    }

    const createOrder = async () => {
        const formItems = {
            name: form.get('name'),
            surname: form.get('surname'),
            address: form.get('address'),
            cardowner: form.get('cardowner'),
            carddate: form.get('carddate'),
            cardcvv: form.get('cardcvv'),
        };
        const empties = Object.keys(formItems).filter(i => {
            return form.get(i) == null;              
        });
        if (empties.length > 0) {
            setFormError(empties);
            return;
        }
        
        const apiUrl = '/api/orders/create';
        const createdOrder: ICreatedOrder = {
            products: basketItems.map(p => ({ id: p.productId, orderPrice: p.price, basketItemId: p.id }))
        };
        await request(apiUrl, 'POST', JSON.stringify(createdOrder), { Authorization: `Bearer ${auth.token}` });  
        setBasketItems([]);
        resetBasketCount();
        setOrderDone(true);
    }

    if (orderDone){
        return (
            <div className="container">
                <Link to="/">Вернуться к покупкам</Link>
            </div>
        )
    }

    return (
    <div className="container">
        <form>
            <h2 className="text-center">Оформление заказа</h2>
            <div className="row">
                <div className="col-md-8 mb-4">
                    <div className="card p-4">
                        <h5>Данные получателя</h5>
                        <div className="row mb-3">
                            <div className="col-md-6 mb-2">
                                <div className="form-outline">
                                    <input type="text" name="name" className="form-control" required={true} disabled={!hasItems} onChange={changeHandler}/>
                                    <label className="form-label" htmlFor="typeText">Имя</label>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className="form-outline">
                                    <input type="text" name="surname" className="form-control" disabled={!hasItems} onChange={changeHandler}/>
                                    <label className="form-label" htmlFor="typeText">Фамилия</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-outline">
                            <input type="text" name="address" className="form-control" disabled={!hasItems} onChange={changeHandler}/>
                            <label className="form-label" htmlFor="typeText">Адрес</label>
                        </div>
                        <hr />
                        <h5>Данные карты</h5>
                        <div className="row mb-3">
                            <div className="col-md-6 mb-2">
                                <div className="form-outline">
                                    <input type="text" name="cardowner" className="form-control" disabled={!hasItems} onChange={changeHandler}/>
                                    <label className="form-label" htmlFor="typeText">Имя владельца</label>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className="form-outline">
                                    <input type="text" name="cardnumber" className="form-control" disabled={!hasItems} onChange={changeHandler}/>
                                    <label className="form-label" htmlFor="typeText">Номер</label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <div className="form-outline">
                                    <input type="text" name="carddate" className="form-control" disabled={!hasItems} onChange={changeHandler}/>
                                    <label className="form-label" htmlFor="typeText">Срок</label>                                
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="form-outline">
                                <input type="text" name="cardcvv" className="form-control" disabled={!hasItems} onChange={changeHandler}/>
                                    <label className="form-label" htmlFor="typeText">CVV</label>                                 
                                </div>
                            </div>
                        </div>
                        <hr className="mb-4" />  
                    { formError.length > 0 && <ErrorMessage message="Заполните все поля" close={() => setFormError([])} /> }                  
                    <button className="btn btn-primary" type="button" disabled={!hasItems} onClick={createOrder}>Заказать</button>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Заказ</span>
                    </h4>

                    {loading && <Loader />}

                    <ul className="list-group mb-3">
                        {
                            basketItems.map((p, i) => {
                                return (
                                <li className="list-group-item d-flex justify-content-between" key={`${p.id}-${i}`}>
                                    <div>
                                        <h6 className="my-0">{p.title}</h6>
                                        <small className="text-muted">{p.categoryTitle}</small>
                                    </div>
                                    <div className="col-md-4 float-right">
                                        <span className="text-muted">{p.price} р.</span>
                                        <button className="btn btn-outline-danger btn-sm mx-2" disabled={loading} onClick={() => removeFromBasket(p)}>Удалить</button>
                                    </div>
                                </li>)
                            })
                        }  
                        <li className="list-group-item d-flex justify-content-between" key={"total"}>
                            <span>Итого</span>
                            <strong>{basketItems.reduce((acc:number, p) => acc + (p.price as number), 0)} р.</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </form>
    </div>
    )
}