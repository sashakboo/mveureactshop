import fs from 'fs';
import { IProduct, IBasketProduct, ICreatedProduct, ICategory, IUpdatedProduct, IListProduct } from "../models";
import { Basket, Category, Product } from '../mongodb/models';

export async function GetCategories(onlyActive: boolean): Promise<Array<ICategory>> {
  let searchParams = {};
  if (onlyActive){
    searchParams = { ...searchParams, active: true };
  }
  const categories = await Category.find(searchParams);

  return categories.map(c => {
    return {
      id: c.id,
      title: c.title,
      active: c.active
    } as ICategory;
  });
}

export async function CreateCategory(categoryName: string): Promise<ICategory> {
  const category = await Category.create({
    title: categoryName,
    active: true
  });

  return {
    id: category.id,
    title: category.title,
    active: category.active
  } as ICategory;
}

export async function UpdateCategory(category: ICategory): Promise<ICategory> {
  const updated = await Category.findByIdAndUpdate(category.id, {
    title: category.title,
    active: category.active ?? true
  });

  return {
    id: updated.id,
    title: updated.title,
    active: updated.active
  } as ICategory;
}

export async function GetProduct(id: string): Promise<IProduct | null> {
  const product = await Product.findById(id).populate<{ category: ICategory }>('category');
  return {
    id: product.id,
    category : {
        id: product.category.id,
        title: product.category.title,
        active: product.category.active,
    },
    title: product.title,
    price: product.price,
    isActive: product.isActive,
    icon: product.icon
  } as IProduct;
}

export async function GetProducts(categoryId: string | null, isActive: boolean | null): Promise<Array<IProduct>> {
  let searchParams = {};
  if (categoryId != null)
    searchParams = { ...searchParams, categoryId: categoryId };

  if (isActive != null)
    searchParams = { ...searchParams, isActive: isActive };

  var products = await Product.find(searchParams).populate<{ category: ICategory }>('category');
  var result = products.map(p => {
      return {
        id: p.id,
        category : {
            id: p.category.id,
            title: p.category.title,
            active: p.category.active,
        },
        title: p.title,
        price: p.price,
        isActive: p.isActive,
        icon: p.icon
      } as IProduct;
  });

  return result;
}

export async function GetListProducts(userId: string, categoryId: string | null, isActive: boolean | null): Promise<Array<IListProduct>> {

  let searchParams = {};
  if (categoryId != null)
    searchParams = { ...searchParams, category: categoryId };
  if (isActive != null)
    searchParams = { ...searchParams, isActive: isActive };
    
  let products = (await Product.find(searchParams).populate<{ category: ICategory }>('category'))
    .filter(e => e.category.active === true);

  const basket = (await Basket.find({ customer: userId })).reduce((acc, e) => {
    acc.set(e.product, (acc.get(e.product) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  const result = products.map(e => {
    return {
      basketCount: basket.get(e.id) ?? 0,
      category: {
        id: e.category.id,
        active: e.category.active,
        title: e.category.title
      },
      icon: e.icon,
      id: e.id,
      isActive: e.isActive,
      price: e.price,
      title: e.title
    } as IListProduct;
  });

  return result;
}

export async function GetBasketProducts(userId: string): Promise<Array<IBasketProduct>> {
  const basket = await Basket.find({ customer: userId });
  const ids = basket.map(e => e.product);
  const products = (await Product.find({ '_id': { $in: ids } }).populate('category')).map(e => {
   return {
    id: e.id,
    category: {
      id: e.category.id,
      active: e.category.active,
      title: e.category.title
    },
    isActive: e.isActive,
    price: e.price,
    icon: '',
    title: e.title
   } as IProduct; 
  });

  const basketProducts = basket.map(e => {
    const product = products.filter(p => p.id == e.product)[0];
    return {
      id: e.id,
      productId: product.id,
      categoryTitle: product.category.title,
      price: product.price,
      title: product.title
    } as IBasketProduct;
  });

  return basketProducts;
}

export async function GetBasketCount(userId: string): Promise<number> {
  const basketCount = await Basket.countDocuments({ customer: userId });
  return basketCount;
}

export async function AddToBasket(productId: string, userId: string): Promise<void> {
  const basketItem = await Basket.create({
    product: productId, 
    customer: userId
  });
  await basketItem.save();
}

export async function RemoveFromBasket(id: string): Promise<void> {
  await Basket.findByIdAndDelete(id);
}

export async function CreateProduct(product: ICreatedProduct): Promise<string | null> {
  const createdProduct = await Product.create({
    title: product.title,
    category: product.categoryId,
    isActive: product.isActive,
    price: product.price
  });

  await createdProduct.save();
  return createdProduct.id;
}

export async function UpdateProduct(product: IUpdatedProduct) {
  const updatedProduct = await Product.findByIdAndUpdate(product.id, {
    category: product.categoryId,
    title: product.title,
    price: product.price,
    isActive: product.isActive
  });

  await updatedProduct.save();
}

export async function UpdateProductIcon(productId: string, iconPath: string) {
  const iconBase64 = fs.readFileSync(iconPath, 'base64');
  const updatedProduct = await Product.findByIdAndUpdate(productId, {
    icon: iconBase64
  });
  await updatedProduct.save();
}