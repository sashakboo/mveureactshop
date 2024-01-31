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

export interface IUpdatedProduct {
    id: number,
    categoryId: number,
    title: string,
    price: number
    iconPath: string | null,
    isActive: boolean
}

export interface ICreatedProduct {
    categoryId: number,
    title: string,
    price: number,
    iconPath: string | null,
    isActive: boolean
}

export interface ICreatedOrder {
    products: Array<{ id: number, orderPrice: number, basketItemId: number }>
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

export interface IUser {
    id: number,
    email: string,
    password: string,
    role: string,
    active: boolean
}
