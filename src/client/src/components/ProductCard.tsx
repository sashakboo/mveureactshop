import { Link } from "react-router-dom";
import { IListProduct } from "../models";
import { useHttp } from "../hooks/http.hook";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export interface IProductCardProps {
    product: IListProduct,
    addToBasketCallback: (product: IListProduct) => void;
}

export default function ProductCard(props: IProductCardProps) {
    const auth = useContext(AuthContext);
    const { loading, request } = useHttp();
    const addToBasket = async (product: IListProduct) => {
        try {
            const apiUrl = `/api/basket/add/${product.id}`;
            await request(apiUrl, 'POST', null, { Authorization: `Bearer ${auth.token}` });  
            props.addToBasketCallback(product); 
        } catch (e) { }
    }

    const getInBasketCount = () => {
        if (props.product.basketCount > 0)
          return ` (${props.product.basketCount})`;

        return null;
    }

    return (
        
        <div className="card" style={{maxWidth: '18rem'}}>
            <img src={`data:image/png;base64,${props.product.icon}`} className="card-img-top" alt={props.product.title} />
            <div className="card-body">
                <h5 className="card-title">{props.product.title}</h5>
                <Link to={`/filter/cat/${props.product.category.id}`} className="card-link ">
                    <p>{props.product.category.title}</p>
                </Link>
                <p className="price">{props.product.price} р.</p>
                <button className="btn btn-outline-primary" type="submit" disabled={loading} onClick={() => addToBasket(props.product)}>
                    В корзину
                    {getInBasketCount()}
                </button>
            </div>
        </div>

    )
}