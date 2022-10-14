import {
  IDeleteProductFromOrderInputDTO,
  IOrderDetailsInputDTO,
  IRegisterOrderInputDTO,
} from "./../src/models/Product";
import { ProductBusiness } from "./../src/business/ProductBusiness";
import { AuthenticatorMock } from "./mocks/AuthenticatorMock";
import { IdGeneratorMock } from "./mocks/IdGeneratorMock";
import { ProductDatabaseMock } from "./mocks/ProductDatabaseMock";

describe("Testando a ProductBusiness", () => {
  const productBusiness = new ProductBusiness(
    new ProductDatabaseMock(),
    new AuthenticatorMock(),
    new IdGeneratorMock()
  );

  // Sucessos nas requisições
  test("Testando função getProducts, deve retornar os produtos", async () => {
    const input = { limit: 2, offset: 0 };

    const response = await productBusiness.getProducts(input);
    expect(response.products!.length).toBe(2);
    expect(response.products![0].name).toBe("Produto mockado");
    expect(response.products![0].id).toBe("1");
    expect(response.products![1].name).toBe("Produto mockado 2");
  });

  test("Testando função getProducts, deve retornar os produtos mesmo sem inserir um limit e offset", async () => {
    const input = {};

    const response = await productBusiness.getProducts(input);
    expect(response.products!.length).toBe(2);
    expect(response.products![0].name).toBe("Produto mockado");
    expect(response.products![0].id).toBe("1");
    expect(response.products![1].name).toBe("Produto mockado 2");
  });

  test("Testando função createOrder, deve retornar uma mensagem", async () => {
    const input: IRegisterOrderInputDTO = {
      token: "token-mock-normal",
      clientName: "Carlos",
      deliveryDate: "2022/10/30",
      products: [
        {
          name: "Produto mockado",
          qty: 5,
          totalPrice: 50,
        },
      ],
    };

    const response = await productBusiness.createOrder(input);
    expect(response.message).toBe(
      "Um pedido foi confirmado no nome de: Carlos, no valor de RS50 e previsto para entrega em 2022/10/30"
    );
  });

  test("Testando a função productFromOrderDeleter, deve retornar uma mensagem", async () => {

      const input: IDeleteProductFromOrderInputDTO = {
        token: "token-mock-normal",
        orderId: "id-mock",
        productName: "Água",
      };

      const response = await productBusiness.productFromOrderDeleter(input);
      expect(response.message).toBe("Produto removido do pedido.")

  });

  test("Testando a função orderDeleter, deve retornar uma mensagem", async () => {

    const input: IOrderDetailsInputDTO = {
      token: "token-mock-normal",
      orderId: "id-mock"
    };

    const response = await productBusiness.orderDeleter(input);
    expect(response.message).toBe("Pedido deletado.")

});

  // Erros da requisição: createOrder
  test("Deve retornar um erro quando inserimos um token errado na função createOrder", async () => {
    expect.assertions(2);

    try {
      const input: IRegisterOrderInputDTO = {
        token: "token-mock-errado",
        clientName: "Carlos",
        deliveryDate: "2022/10/30",
        products: [
          {
            name: "Produto mockado",
            qty: 5,
            totalPrice: 50,
          },
        ],
      };

      await productBusiness.createOrder(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe("Token inválido");
    }
  });

  test("Deve retornar um erro quando tentamos registrar um pedido com uma data de entrega em uma data que ja passou", async () => {
    expect.assertions(2);

    try {
      const input: IRegisterOrderInputDTO = {
        token: "token-mock-normal",
        clientName: "Carlos",
        deliveryDate: "2022/5/30",
        products: [
          {
            name: "Produto mockado",
            qty: 2,
            totalPrice: 50,
          },
        ],
      };

      await productBusiness.createOrder(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(
        "Por favor verifique a data de entrega, não é possível inserir uma data que já passou."
      );
    }
  });

  test("Deve retornar um erro quando tentamos registrar um pedido com um produto que não existe no estoque", async () => {
    expect.assertions(2);

    try {
      const input: IRegisterOrderInputDTO = {
        token: "token-mock-normal",
        clientName: "Carlos",
        deliveryDate: "2022/12/30",
        products: [
          {
            name: "Produto inexistente",
            qty: 2,
            totalPrice: 50,
          },
        ],
      };

      await productBusiness.createOrder(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe(
        "Produto inexistente não existe no nosso catálogo."
      );
    }
  });

  test("Deve retornar um erro quando tentamos adicionar um produto mais não há suficiente no estoque", async () => {
    expect.assertions(2);

    try {
      const input: IRegisterOrderInputDTO = {
        token: "token-mock-normal",
        clientName: "Carlos",
        deliveryDate: "30/10/2022",
        products: [
          {
            name: "Produto mockado",
            qty: 500,
            totalPrice: 50,
          },
        ],
      };

      await productBusiness.createOrder(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(
        "Não possuimos 500 'Produto mockado' no estoque, possuimos: 300"
      );
    }
  });

  // Erros da requisição: productFromOrderDeleter

  test("Deve retornar um erro quando inserimos um token errado na função productFromOrderDeleter", async () => {
    expect.assertions(2);

    try {
      const input: IDeleteProductFromOrderInputDTO = {
        token: "token-mock-errado",
        orderId: "id-mock",
        productName: "Produto mockado",
      };

      await productBusiness.productFromOrderDeleter(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe("Token inválido");
    }
  });

  test("Deve retornar um erro quando tentamos remover um produto inserindo um ID de um pedido que não existe", async () => {
    expect.assertions(2);

    try {
      const input: IDeleteProductFromOrderInputDTO = {
        token: "token-mock-normal",
        orderId: "id-errado",
        productName: "Produto mockado",
      };

      await productBusiness.productFromOrderDeleter(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Pedido com este id não existe.");
    }
  });

  test("Deve retornar um erro quando tentamos remover um produto de um pedido que não existe tal produto dentro", async () => {
    expect.assertions(2);

    try {
      const input: IDeleteProductFromOrderInputDTO = {
        token: "token-mock-normal",
        orderId: "id-mock",
        productName: "Produto inexistente",
      };

      await productBusiness.productFromOrderDeleter(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe(
        "Dentro deste pedido não existe um produto com este nome."
      );
    }
  });

  test("Deve retornar um erro quando tentamos remover um produto de um pedido que não existe tal produto dentro", async () => {
    expect.assertions(2);

    try {
      const input: IDeleteProductFromOrderInputDTO = {
        token: "token-mock-normal",
        orderId: "id-mock",
        productName: "Produto inexistente",
      };

      await productBusiness.productFromOrderDeleter(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe(
        "Dentro deste pedido não existe um produto com este nome."
      );
    }
  });

  // Erros da requisição: orderDeleter

  test("Deve retornar um erro quando inserimos um token errado na função orderDeleter", async () => {
    expect.assertions(2);

    try {
      const input: IOrderDetailsInputDTO = {
        token: "token-mock-errado",
        orderId: "id-mock"
      };

      await productBusiness.orderDeleter(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe("Token inválido");
    }
  });

  test("Deve retornar um erro quando tentamos remover um pedido inserindo um ID de um pedido que não existe", async () => {
    expect.assertions(2);

    try {
      const input: IOrderDetailsInputDTO = {
        token: "token-mock-normal",
        orderId: "id-errado"
      };

      await productBusiness.orderDeleter(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Pedido com este id não existe.");
    }
  });
});
