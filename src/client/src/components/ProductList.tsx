import ProductCard from "./ProductCard";
import { IListProduct } from "../models";

export interface IProductListProps {
    products: Array<IListProduct>
    addToBasketCallback: (product: IListProduct) => void
}

export default function ProductList(props: IProductListProps) {
    return (
        <div className="container my-3">
            <div className="text-center">
                <div className="row">
                    {
                        props.products.map(p => {
                            return (
                                <div className="col-lg-3 col-md-6 mb-4" key={p.id}>
                                    <ProductCard product={p} addToBasketCallback={props.addToBasketCallback} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}