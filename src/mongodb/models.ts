import { model, Schema } from "mongoose";
import { IBasketProduct, ICategory, IProduct, IUser } from "../models";


const userSchema = new Schema<IUser>({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: { type: Boolean, required: true }
});
const User = model('User', userSchema);

const categorySchema = new Schema<ICategory>({
  title: { type: String, required: true },
  active: { type: Boolean, required: true }
});
const Category = model('Category', categorySchema);

const productSchema = new Schema<IProduct>({
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  icon: { type: String, required: false },
  title: { type: String, required: false },
  price: { type: Number, required: true },
  isActive: { type: Boolean, required: true }
});
const Product = model('Product', productSchema);

const basketSchema = new Schema({
  customer: { type: String, required: true },
  product: { type: String, required: true }
});
const Basket = model('Basket', basketSchema);

const orderSchema = new Schema({
  created: Date,
  customerEmail: String,
  state: String,
  itemsCount: Number,
  totalCost: Number
});
const Order = model('Order', orderSchema);


export { User, Category, Product, Basket, Order }
