import { useContext, useEffect, useState } from "react";
import FilterPanel from "../components/FilterPanel";
import { IListProduct } from "../models";
import ProductList from "../components/ProductList";
import { useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { NotifyContext } from "../context/NotifyContext";
import { Loader } from "../components/Loader";

export default function ProductsPage() {
    const [ productList, setProducts ] = useState<Array<IListProduct>>([]);

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);
    const categoryId = parseInt(useParams().id ?? '');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = Number.isNaN(categoryId) ? '/api/products' : `/api/products/${categoryId}`;
                const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
                const data = response as Array<IListProduct>;
                setProducts(data);    
            } catch (e) { }
        }
        fetchProducts();
    }, [categoryId]);

    const { changeBasketCount } = useContext(NotifyContext);

    const addToBasketHandler = async (product: IListProduct) => {
        changeBasketCount(1); 
        setProducts(oldProducts => {
            return oldProducts.map(p => {
                if (p.id === product.id){
                    return {
                        ...p,
                        basketCount: p.basketCount + 1
                    }
                }
                return p;
            })
        });
    }

    return (
        <div>
            {loading && <Loader />}
            <FilterPanel />
            <ProductList products={[...productList]} addToBasketCallback={addToBasketHandler} />
        </div>
    )
}