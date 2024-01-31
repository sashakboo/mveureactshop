export interface ICategory {
    id: number,
    title: string,
    active: boolean
}

export interface IProduct {
    id: number,
    category: ICategory,
    icon: string,
    title: string,
    price: number,
    isActive: boolean
}

export interface IListProduct extends IProduct {
    basketCount: number
}

export interface IBasketProduct {
    id: number,
    title: string,
    productId: number,
    categoryTitle: string,
    price: number
}

export interface IUser {
    id: number,
    role: string,
    email: string,
    password: string,
    active: boolean
}

export interface IUpdatedProduct {
    id: number,
    categoryId: number,
    title: string,
    price: number,
    isActive: boolean,
    iconPath: string | null
}

export interface ICreatedProduct {
    categoryId: number,
    title: string,
    price: number,
    isActive: boolean,
    iconPath: string | null
}

export interface ICreatedOrder {
    products: Array<{ id: number, orderPrice: number, basketItemId: number  }>
}

export interface IOrder {
    id: number,
    created: Date,
    customerEmail: string,
    state: string,
    itemsCount: number,
    totalCost: number
}

export interface IOrderState {
    id: number,
    name: string,
    title: string
}

export interface IUpdateOrderState {
    orderId: number,
    state: number
}