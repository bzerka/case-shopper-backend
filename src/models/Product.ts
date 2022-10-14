export interface IProductInputDTO {
    name: string,
    qty: number,
    totalPrice: number
}

export interface IRegisterOrderInputDTO {
    token: string,
    clientName: string,
    deliveryDate: string,
    products: IProductInputDTO[]
}

export interface IGetProductsInputDTO {
    limit?: number,
    offset?: number
}

export interface IOrderDB {
    id: string,
    creator_name: string,
    client_name: string,
    delivery_date: Date | string,
    total_price: number
}

export interface IDeleteProductFromOrderInputDTO {
    token: string,
    orderId: string,
    productName: string
}

export interface IOrderDetailsOutputDB {
    product_name: string,
    product_qty: number,
    total_price: number
}

export interface IGetOrdersInputDTO {
    token: string,
    userId: string
}

export interface IOrderDetailsInputDTO {
    token: string,
    orderId: string
}

export interface IProductDB {
    id: string,
    name: string,
    price: number,
    qty_stock: number
}

export interface IRegisterProductOrderDB {
    order_id: string,
    product_name: string,
    product_qty: number,
    total_price: number
}


export class Product {
    constructor(
        private id: string,
        private name: string,
        private price: number,
        private qty_stock: number
    ) {}

    public getId = () => {
        return this.id
    }

    public getName = () => {
        return this.name
    }

    public getPrice = () => {
        return this.price
    }

    public getQtyStock = () => {
        return this.qty_stock
    }

    public setId = (newId: string) => {
        this.id = newId
    }

    public setName = (newName: string) => {
        this.name = newName
    }

    public setPrice = (newPrice: number) => {
        this.price = newPrice
    }

    public setQty_stock = (newQtyStock: number) => {
        this.qty_stock = newQtyStock
    }
}