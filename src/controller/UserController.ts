import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseError } from "../errors/BaseError";
import { IGetOrdersInputDTO, IOrderDetailsInputDTO } from "../models/Product";
import { ILoginInputDTO, ISignupInputDTO } from "../models/User";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  public signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const input: ISignupInputDTO = { name, email, password };

      const response = await this.userBusiness.signup(input);

      res.status(201).send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro inesperado" });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const input: ILoginInputDTO = { email, password };

      const token = await this.userBusiness.login(input);

      res.status(200).send(token);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro inesperado" });
    }
  };

  public getOrders = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;

      const response = await this.userBusiness.getAllOrders(token);

      res.send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro inesperado" });
    }
  };

  public getOrderDetails = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const orderId = req.params.orderId;

      const input: IOrderDetailsInputDTO = { token, orderId };

      const response = await this.userBusiness.getOrderDetails(input);

      res.send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro inesperado" });
    }
  };
}
