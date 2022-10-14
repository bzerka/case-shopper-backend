import { IOrderDB, IOrderDetailsOutputDB } from "../models/Product";
import { IUserDB, User } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "Shopper_Employees";
  public static TABLE_ORDERS = "Shopper_Orders";
  public static TABLE_ORDER_PRODUCTS = "Shopper_Order_Products";

  public toUserDBModel = (user: User): IUserDB => {
    const userDB: IUserDB = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
    };

    return userDB;
  };

  public findByEmail = async (email: string): Promise<User | undefined> => {
    const result: IUserDB[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    )
      .select()
      .where({ email });

    if (result.length === 0) {
      return undefined;
    }

    const user = new User(
      result[0].id,
      result[0].name,
      result[0].email,
      result[0].password
    );

    return user;
  };

  public findByname = async (name: string): Promise<User | undefined> => {
    const result: IUserDB[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    )
      .select()
      .where({ name });

    if (result.length === 0) {
      return undefined;
    }

    const user = new User(
      result[0].id,
      result[0].name,
      result[0].email,
      result[0].password
    );

    return user;
  };

  public createUser = async (user: User): Promise<void> => {
    const userDB: IUserDB = this.toUserDBModel(user);

    await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(userDB);
  };

  public getAllOrders = async (): Promise<IOrderDB[] | undefined> => {

    const orderHistory: IOrderDB[] = await BaseDatabase.connection(UserDatabase.TABLE_ORDERS)

    if(orderHistory.length === 0) {
      return undefined
    }

    return orderHistory
  }

  public getOrderDetails = async (orderId: string): Promise<IOrderDetailsOutputDB[] | undefined> => {
    const orderDetails: IOrderDetailsOutputDB[] = await BaseDatabase.connection(UserDatabase.TABLE_ORDER_PRODUCTS)
    .select('product_name', 'product_qty', 'total_price')
    .where({order_id: orderId})

    if(orderDetails.length === 0) {
      return undefined
    }

    return orderDetails
  }

}
