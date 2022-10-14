import { IUserDB, User } from "../../src/models/User";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import {
  IOrderDB,
  IOrderDetailsInputDTO,
  IOrderDetailsOutputDB,
} from "../../src/models/Product";

export class UserDatabaseMock extends BaseDatabase {
  public static TABLE_USERS = "Lama_Users";

  public toUserDBModel = (user: User) => {
    const userDB: IUserDB = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
    };

    return userDB;
  };

  public findByEmail = async (email: string): Promise<User | undefined> => {
    switch (email) {
      case "igor@gmail.com":
        const user1 = new User(
          "id-mock",
          "igor",
          "igor@gmail.com",
          "hash-password"
        );

        return user1;

      case "usuario@gmail.com":
        const user2 = new User(
          "id-mock",
          "usuario",
          "usuario@gmail.com",
          "hash-password2"
        );

        return user2;

      default:
        return undefined;
    }
  };

  public findByname = async (name: string): Promise<User | undefined> => {
    switch (name) {
      case "igor":
        const user1 = new User(
          "id-mock",
          "igor",
          "igor@gmail.com",
          "hash-password"
        );

        return user1;
      default:
        return undefined;
    }
  };

  public createUser = async (user: User): Promise<void> => {};

  public getAllOrders = async (): Promise<IOrderDB[] | undefined> => {
    const orderMock1 = [
      {
        id: "id-mock",
        creator_name: "igor",
        client_name: "client",
        delivery_date: "30/10/2022",
        total_price: 20,
      },
    ];
    return orderMock1;
  };

  public getOrderDetails = async (
    orderId: string
  ): Promise<IOrderDetailsOutputDB[] | undefined> => {
    switch (orderId) {
      case "id-mock":
        const orderDetails = [
          {
            product_name: "Água mineral",
            product_qty: 2,
            total_price: 5,
          },
          {
            product_name: "Água com gás",
            product_qty: 5,
            total_price: 25,
          }
        ];
        return orderDetails;
      default:
        return undefined;
    }
  };
}
