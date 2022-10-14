import { ProductBusiness } from "./../business/ProductBusiness";
import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";
import { IDeleteProductFromOrderInputDTO, IGetProductsInputDTO, IOrderDetailsInputDTO, IRegisterOrderInputDTO } from "../models/Product";

export class ProductController {
  constructor(private productBusiness: ProductBusiness) {}

  public getProducts = async (req: Request, res: Response) => {
    try {

      const limit = Number(req.query.limit);
      const offset = Number(req.query.offset)

      const input: IGetProductsInputDTO = { limit, offset }

      const products = await this.productBusiness.getProducts(input);

      res.status(200).send(products);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro inesperado" });
    }
  };

  public registerOrder = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const { clientName, deliveryDate, products } = req.body;

      const input: IRegisterOrderInputDTO = {
        token,
        clientName,
        deliveryDate,
        products,
      };

      const response = await this.productBusiness.createOrder(input);

      res.status(201).send(response);
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro inesperado" });
    }
  };

  public deleteProductFromOrder = async (req: Request, res: Response) => {
    try {
      
      const token = req.headers.authorization as string
      const orderId = req.params.orderId
      const productName = req.params.productName
      
      const input: IDeleteProductFromOrderInputDTO = { token, orderId, productName }
      
      const response = await this.productBusiness.productFromOrderDeleter(input)
      
      res.send(response)
      
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro inesperado" });
    }
  }

  public deleteOrder = async (req: Request, res: Response) => {
    try {

      const token = req.headers.authorization as string
      const orderId = req.params.id

      const input: IOrderDetailsInputDTO = { token, orderId}

      const response = await this.productBusiness.orderDeleter(input)

      res.status(200).send(response)
      
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro inesperado" });
    }
  }
}
