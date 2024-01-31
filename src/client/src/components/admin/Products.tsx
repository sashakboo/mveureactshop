import { useState, useContext, useEffect } from "react";
import { EditableTable, IEditableTableProps, InputTypes } from "../EditableTable";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { ICategory, ICreatedProduct, IProduct, IUpdatedProduct } from "../../models";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";

export interface IProductsProps {
  products: Array<IProduct>,
  categories: Array<ICategory>,
  updateProduct: (product: IProduct) => void,
  createProduct: (product: IProduct) => void
}

export default function Products(props: IProductsProps) {
  const [ products, setProducts ] = useState<Array<IProduct>>([...props.products]);
  const [ categories, setCategories ] = useState<Array<ICategory>>([...props.categories]);
  const { request, error, clearError, loading } = useHttp();
  const auth = useContext(AuthContext);
 
  const createIcon = async(file: File) => {
    const apiUrl = `/api/files/createicon`;
    const formData = new FormData();
    formData.append('icon', file);
    const response = await request(apiUrl, 'POST', formData, { Authorization: `Bearer ${auth.token}` });
    return response.filePath as string;
  }

  const updateProduct = async (product: IUpdatedProduct) => {
    const apiUrl = '/api/products/update';
    const response = await request(apiUrl, 'POST', JSON.stringify(product), { Authorization: `Bearer ${auth.token}` });
    return response as IProduct;
  }

  const createProduct = async (product: ICreatedProduct) => {
    const apiUrl = '/api/products/create';
    const response = await request(apiUrl, 'POST', JSON.stringify(product), { Authorization: `Bearer ${auth.token}` });
    return response as IProduct;
  }

  const updateProductHandler = async (sourceObj: object, form: Map<string, any>) => {
    const icon = form.get('icon') as File;
    let iconPath = null;
    if (icon != null) {
      iconPath = await createIcon(icon);
    }
    const product = sourceObj as IProduct;
    const updatedProduct: IUpdatedProduct = {
      id: product.id,
      categoryId: form.get('category') as number ?? product.category.id,
      title: form.get('title') as string ?? product.title,
      price: form.get('price') as number ?? product.price,
      iconPath: iconPath ?? null,
      isActive: form.get('isactive') == null ? product.isActive : form.get('isactive') == 1 ?? false
    }

    const updateResult = await updateProduct(updatedProduct);
    setProducts(products.map(p => {
      if (p.id === updateResult?.id)
        return updateResult;

      return p;
    }));
    props.updateProduct(updateResult)
  }

  const addProductHandler = async (form: Map<string, any>) => {
    const icon = form.get('icon') as File;
    let iconPath = null;
    if (icon != null) {
      iconPath = await createIcon(icon);
    }

    const newProduct: ICreatedProduct = {
      categoryId: form.get('category') as number,
      title: form.get('title') as string,
      price: form.get('price') as number,
      iconPath: iconPath ?? null,
      isActive: form.get('isactive') == 1 ? true : false
    }      
    const result = await createProduct(newProduct) as IProduct;
    setProducts([ result, ...products ]);
    props.createProduct(result)
  }

  const categorySelectItems = categories.map(c => ({ id: c.id, title: c.title }));
  const isActiveSelectItems = [ { id: 1, title: 'Да' }, { id: 0, title: 'Нет' } ];
  const tableProps: IEditableTableProps = {
    columnsIds: [ 'id', 'category', 'title', 'price', 'isactive', 'icon' ],
    columnsTitle: [ 'ID', 'Категория', 'Имя', 'Цена', 'Вкл.', 'Фото'],
    inputTypes: [ null, InputTypes.select, InputTypes.text, InputTypes.number, InputTypes.select, InputTypes.image ],
    selectItems: [ null, categorySelectItems, null, null, isActiveSelectItems, null ],
    values: products.map((p) => {
      return [ p.id, p.category.title, p.title, p.price, p.isActive ? 'Да' : 'Нет', p.icon]
    }),
    sourceObjs: [ ...products ],
    canAddNew: true,
    updateItem: updateProductHandler,
    addNewItem: addProductHandler
  }

  return (
    <div className="container">
      { error != null && <ErrorMessage message={error} close={clearError}/> }
      {loading && <Loader />}
      <EditableTable {...tableProps}/>
    </div>
  )
}