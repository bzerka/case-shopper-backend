import {
  IDeleteProductFromOrderInputDTO,
  IGetOrdersInputDTO,
  IGetProductsInputDTO,
  IOrderDB,
  IOrderDetailsInputDTO,
  IProductDB,
  IRegisterOrderInputDTO,
  Product,
} from "./../models/Product";
import { ProductDatabase } from "../database/ProductDatabase";
import { AuthenticationError } from "../errors/AuthenticationError";
import { AuthorizationError } from "../errors/AuthorizationError";
import { ParamsError } from "../errors/ParamsError";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { NotFoundError } from "../errors/NotFoundError";

export class ProductBusiness {
  constructor(
    private productDataBase: ProductDatabase,
    private authenticator: Authenticator,
    private idGenerator: IdGenerator
  ) {}

  public getProducts = async (input: IGetProductsInputDTO) => {
    let { limit, offset } = input;

    if (!limit) {
      limit = 20;
    }

    if (!offset) {
      offset = 0;
    }

    const products = await this.productDataBase.getProducts(limit, offset);

    const response = {
      products,
    };

    return response;
  };

  public createOrder = async (input: IRegisterOrderInputDTO) => {
    const { token, clientName, deliveryDate, products } = input;

    if (!clientName) {
      throw new ParamsError("Necessário preencher o campo 'client name'");
    }

    if (!deliveryDate) {
      throw new ParamsError("Necessário preencher o campo 'delivery date'");
    }

    if (products.length === 0 || !products) {
      throw new ParamsError("Necessário adicionar produtos ao pedido.");
    }

    if (!token) {
      throw new AuthenticationError("Necessário enviar um token");
    }

    const tokenData = this.authenticator.getTokenPayload(token);

    if (!tokenData) {
      throw new AuthorizationError("Token inválido");
    }

    // Verificar se a data de entrega é posterior ao dia de hoje
    const [year, month, day]: string[] = deliveryDate.split("/");

    const currentDate = new Date();
    const deliveryDateToCompare = new Date(`${month}/${day}/${year}`);

    if (currentDate > deliveryDateToCompare) {
      throw new ParamsError(
        "Por favor verifique a data de entrega, não é possível inserir uma data que já passou."
      );
    }

    const allProducts: IProductDB[] = await this.productDataBase.getProducts(100,0);

    // Comparando a quantidade do item no estoque com a quantidade da lista.
    products.map((productOrdered) => {
      const findProductOnStock = allProducts.find((product: IProductDB) => {
        return product.name === productOrdered.name;
      });

      if (!findProductOnStock) {
        throw new NotFoundError(
          `${productOrdered.name} não existe no nosso catálogo.`
        );
      }

      if (findProductOnStock.qty_stock < productOrdered.qty) {
        throw new ParamsError(
          `Não possuimos ${productOrdered.qty} '${
            productOrdered.name
          }' no estoque, possuimos: ${findProductOnStock!.qty_stock}`
        );
      }
    });

    // Atualizar o numero do estoque após o pedido
    for (let product of products) {
      await this.productDataBase.removeProductFromStock(
        product.name,
        product.qty
      );
    }

    const id = this.idGenerator.generate();

    const creator_name = tokenData.name;

    const total_price = products
      .map((product) => product.totalPrice)
      .reduce((curr, prev) => curr + prev, 0);

    const dateDB: string = deliveryDate;

    const order: IOrderDB = {
      id,
      creator_name,
      client_name: clientName,
      delivery_date: new Date(dateDB),
      total_price,
    };

    await this.productDataBase.insertOrder(order);

    for (let product of products) {
      const registerProductInfo = {
        order_id: order.id,
        product_name: product.name,
        product_qty: product.qty,
        total_price: product.totalPrice,
      };

      await this.productDataBase.insertProductsToOrder(registerProductInfo);
    }

    const response = {
      message: `Um pedido foi confirmado no nome de: ${clientName}, no valor de RS${total_price} e previsto para entrega em ${deliveryDate}`,
    };

    return response;
  };

  public productFromOrderDeleter = async (
    input: IDeleteProductFromOrderInputDTO
  ) => {
    const { token, orderId, productName } = input;

    if (!orderId) {
      throw new ParamsError("Necessário receber um id do pedido.");
    }

    if (!productName) {
      throw new ParamsError("Necessário receber o nome do produto.");
    }

    if (!token) {
      throw new AuthenticationError("Necessário enviar um token");
    }

    const tokenData = this.authenticator.getTokenPayload(token);

    if (!tokenData) {
      throw new AuthorizationError("Token inválido");
    }

    const orderExists = await this.productDataBase.getOrderById(orderId);

    if (!orderExists) {
      throw new NotFoundError("Pedido com este id não existe.");
    }

    const productExists = await this.productDataBase.findProductInsideOrder(
      orderId,
      productName
    );

    if (!productExists) {
      throw new NotFoundError(
        "Dentro deste pedido não existe um produto com este nome."
      );
    }

    // deletando o produto
    await this.productDataBase.deleteProductInsideOrder(orderId, productName);

    //atualizando o totalprice do pedido
    await this.productDataBase.updateOrderTotalPrice(
      orderId,
      productExists.total_price
    );

    // checar se o pedido possui algum produto, se não possuir, deletar o pedido também
    await this.productDataBase.checkIfOrderHasProducts(orderId);

    // devolver o produto ao stock
    await this.productDataBase.addProductIntoStock(
      productName,
      productExists.product_qty
    );

    const response = {
      message: "Produto removido do pedido.",
    };

    return response;
  };

  public orderDeleter = async (input: IOrderDetailsInputDTO) => {
    const { token, orderId } = input;

    if (!orderId || orderId === ":id") {
      throw new ParamsError("Necessário receber um id do pedido");
    }

    if (!token) {
      throw new AuthenticationError("Necessário enviar um token");
    }

    const tokenData = this.authenticator.getTokenPayload(token);

    if (!tokenData) {
      throw new AuthorizationError("Token inválido");
    }

    const orderExists = await this.productDataBase.getOrderById(orderId);

    if (!orderExists) {
      throw new NotFoundError("Pedido com este id não existe.");
    }

    // Encontrar produtos dentro do pedido para adicionar ao stock a quantidade deles
    const orderProducts = await this.productDataBase.getProductsInsideOrder(
      orderId
    );

    for (let product of orderProducts) {
      await this.productDataBase.addProductIntoStock(
        product.product_name,
        product.product_qty
      );
    }

    await this.productDataBase.deleteOrder(orderId);

    const response = {
      message: "Pedido deletado.",
    };

    return response;
  };
}
