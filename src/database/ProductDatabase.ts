import { IOrderDB, IProductDB, IRegisterProductOrderDB, Product } from "../models/Product";
import { BaseDatabase } from "./BaseDatabase";

export class ProductDatabase extends BaseDatabase {
  public static TABLE_PRODUCTS = "Shopper_Products";
  public static TABLE_ORDERS = "Shopper_Orders";
  public static TABLE_ORDER_PRODUCTS = "Shopper_Order_Products";

  public getProducts = async (limit: number, offset: number): Promise<IProductDB[]> => {

    const productsDB: IProductDB[] = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
    .limit(limit)
    .offset(offset)

    return productsDB
  };

  public insertOrder = async (order: IOrderDB): Promise<void> => {

    await BaseDatabase.connection(ProductDatabase.TABLE_ORDERS)
    .insert(order)

  }

  public insertProductsToOrder = async (registerProductInfo: IRegisterProductOrderDB) => {
    await BaseDatabase.connection(ProductDatabase.TABLE_ORDER_PRODUCTS)
    .insert(registerProductInfo)
  }

  public removeProductFromStock = async (productName: string, productQty: number): Promise<void> => {

    const findProduct = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
    .where({name: productName})

    const newStockValue = findProduct[0].qty_stock - productQty

    await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
    .update({qty_stock: newStockValue})
    .where({name: productName})
  }

  public addProductIntoStock = async (productName: string, productQty: number): Promise<void> => {
    const findProduct = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
    .where({name: productName})

    const newStockValue = findProduct[0].qty_stock + productQty

    await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
    .update({qty_stock: newStockValue})
    .where({name: productName})
  }

  public getOrderById = async (id: string): Promise<IOrderDB | undefined> => {
    const order: IOrderDB[] = await BaseDatabase.connection(ProductDatabase.TABLE_ORDERS)
    .where({id})

    if(order.length === 0) {
      return undefined
    }

    return order[0]

  }

  public deleteOrder = async (id: string): Promise<void> => {

    await BaseDatabase.connection(ProductDatabase.TABLE_ORDER_PRODUCTS)
    .delete()
    .where({order_id: id})
    
    await BaseDatabase.connection(ProductDatabase.TABLE_ORDERS)
    .delete()
    .where({id})

  }

  public findProductInsideOrder = async (id: string, productName: string): Promise<IRegisterProductOrderDB | undefined> => {

    const productInsideOrder: IRegisterProductOrderDB[] = await BaseDatabase.connection(ProductDatabase.TABLE_ORDER_PRODUCTS)
    .where({ order_id: id, product_name: productName})

    if(productInsideOrder.length === 0) {
      return undefined
    }

    return productInsideOrder[0]
  }

  public deleteProductInsideOrder = async (id: string, productName: string): Promise<void> => {

    await BaseDatabase.connection(ProductDatabase.TABLE_ORDER_PRODUCTS)
    .delete()
    .where({ order_id: id, product_name: productName})
  
  }

  public checkIfOrderHasProducts = async (id: string): Promise<void> => {

    // Achando o pedido
     const order: IOrderDB[] = await BaseDatabase.connection(ProductDatabase.TABLE_ORDERS)
     .where({id})
     
     // Se o pedido tiver um preço total de 0, significa que não há produtos lá dentro, então excluir
     // também o pedido
     if(order[0].total_price === 0) {
       await BaseDatabase.connection(ProductDatabase.TABLE_ORDERS)
       .delete()
       .where({id})
     }
  }
    
  public updateOrderTotalPrice = async (id: string, priceToRemove: number): Promise<void> => {

    const findOrder = await BaseDatabase.connection(ProductDatabase.TABLE_ORDERS)
    .where({id})    

    const newTotalPrice = findOrder[0].total_price - priceToRemove

    await BaseDatabase.connection(ProductDatabase.TABLE_ORDERS)
    .update({total_price: newTotalPrice})
    .where({id})
  }

  public getProductsInsideOrder = async (id: string): Promise<IRegisterProductOrderDB[]> => {
    const productInsideOrder: IRegisterProductOrderDB[] = await BaseDatabase.connection(ProductDatabase.TABLE_ORDER_PRODUCTS)
    .where({ order_id: id})

    return productInsideOrder
  }
}
