import {
  IProductDB,
  IRegisterProductOrderDB,
} from "./../../src/models/Product";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { IOrderDB } from "../../src/models/Product";

export class ProductDatabaseMock extends BaseDatabase {
  public static TABLE_PRODUCTS = "Shopper_Products";
  public static TABLE_ORDERS = "Shopper_Orders";

  public getProducts = async (): Promise<IProductDB[]> => {
    const productsMock: IProductDB[] = [
      {
        id: "1",
        name: "Produto mockado",
        price: 10,
        qty_stock: 300,
      },
      {
        id: "1",
        name: "Produto mockado 2",
        price: 15,
        qty_stock: 3,
      },
    ];

    return productsMock;
  };

  public insertOrder = async (order: IOrderDB): Promise<void> => {};

  public updateProductStock = async (
    productName: string,
    productQty: number
  ): Promise<void> => {};

  public insertProductsToOrder = async (
    registerProductInfo: IRegisterProductOrderDB
  ): Promise<void> => {};

  public removeProductFromStock = async (
    productName: string,
    productQty: number
  ): Promise<void> => {};

  public addProductIntoStock = async (
    productName: string,
    productQty: number
  ): Promise<void> => {};

  public getOrderById = async (id: string): Promise<IOrderDB | undefined> => {
    switch (id) {
      case "id-mock":
        const orderMock1: IOrderDB = {
          id: "id-mock",
          client_name: "igor",
          creator_name: "usuario",
          delivery_date: new Date(2022 / 10 / 10),
          total_price: 50,
        };
        return orderMock1;
      default:
        return undefined;
    }
  };

  public deleteOrder = async (id: string): Promise<void> => {};

  public findProductInsideOrder = async (
    id: string,
    productName: string
  ): Promise<IRegisterProductOrderDB | undefined> => {
    if (id === "id-mock" && productName === "Água") {
      const productInsideOrderMock: IRegisterProductOrderDB = {
        order_id: "id-mock",
        product_name: "Água",
        product_qty: 10,
        total_price: 50,
      };
      return productInsideOrderMock;
    } else {
      return undefined;
    }
  };

  public deleteProductInsideOrder = async (
    id: string,
    productName: string
  ): Promise<void> => {};

  public checkIfOrderHasProducts = async (id: string): Promise<void> => {};

  public updateOrderTotalPrice = async (
    id: string,
    priceToRemove: number
  ): Promise<void> => {};

  public getProductsInsideOrder = async (
    id: string
  ): Promise<IRegisterProductOrderDB[]> => {
    const productsInsideOrderMock: IRegisterProductOrderDB[] = [
      {
        order_id: "id-mock",
        product_name: "Água",
        product_qty: 10,
        total_price: 50,
      },
      {
        order_id: "id-mock",
        product_name: "Batata",
        product_qty: 5,
        total_price: 20,
      },
    ];
    return productsInsideOrderMock;
  };
}
