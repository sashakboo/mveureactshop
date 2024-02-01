export interface ICategory {
    id: string,
    title: string,
    active: boolean
}

export interface IProduct {
    id: string,
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
    id: string,
    title: string,
    productId: string,
    categoryTitle: string,
    price: number
}

export interface IUpdatedProduct {
    id: string,
    categoryId: string,
    title: string,
    price: number
    iconPath: string | null,
    isActive: boolean
}

export interface ICreatedProduct {
    categoryId: string,
    title: string,
    price: number,
    iconPath: string | null,
    isActive: boolean
}

export interface ICreatedOrder {
    products: Array<{ id: string, orderPrice: number, basketItemId: string }>
}

export interface IOrder {
    id: string,
    created: Date,
    customerEmail: string,
    state: string,
    itemsCount: number,
    totalCost: number
}

export interface IOrderState {
    id: string,
    name: string,
    title: string
}

export interface IUpdateOrderState {
    orderId: string,
    state: string
}

export interface IUser {
    id: string,
    email: string,
    password: string,
    role: string,
    active: boolean
}
