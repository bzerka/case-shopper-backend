import { UserBusiness } from "../src/business/UserBusiness";
import {
  IGetOrdersInputDTO,
  IOrderDetailsInputDTO,
} from "../src/models/Product";
import { ILoginInputDTO, ISignupInputDTO } from "../src/models/User";
import { AuthenticatorMock } from "./mocks/AuthenticatorMock";
import { HashManagerMock } from "./mocks/HashManagerMock";
import { IdGeneratorMock } from "./mocks/IdGeneratorMock";
import { UserDatabaseMock } from "./mocks/UserDatabaseMock";

describe("Testando a UserBusiness", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new HashManagerMock(),
    new AuthenticatorMock()
  );

  // Sucessos das requisições
  test("Um token é retornado quando o cadastro é bem-sucedido", async () => {
    const input: ISignupInputDTO = {
      email: "fulano@gmail.com",
      name: "Fulano",
      password: "fulano123",
    };

    const response = await userBusiness.signup(input);
    expect(response.message).toBe("Cadastro realizado com sucesso.");
    expect(response.token).toBe("token-mock-normal");
  });

  test("Um token é retornado quando o login é bem-sucedido", async () => {
    const input: ILoginInputDTO = {
      email: "igor@gmail.com",
      password: "password",
    };

    const response = await userBusiness.login(input);
    expect(response.message).toBe("Login realizado com sucesso");
    expect(response.token).toBe("token-mock-normal");
  });

  test("Testando função getAllOrders, deve retornar o histórico de pedidos", async () => {
    const token = "token-mock-normal";

    const response = await userBusiness.getAllOrders(token);
    expect(response.orderHistory![0]).toEqual({
      id: "id-mock",
      creator_name: "igor",
      client_name: "client",
      delivery_date: "30/10/2022",
      total_price: 20,
    });
  });

  test("Testando função getOrderDetails, deve retornar os produtos de um pedido", async () => {
    const input: IOrderDetailsInputDTO = {
      token: "token-mock-normal",
      orderId: 'id-mock'
    };

    const response = await userBusiness.getOrderDetails(input);
    expect(response.orderDetails).toEqual([
      {
        product_name: "Água mineral",
        product_qty: 2,
        total_price: 5,
      },
      {
        product_name: "Água com gás",
        product_qty: 5,
        total_price: 25,
      },
    ]);
  });

  // Erros da requisição: signup
  test("Um erro é retornado quando o name é menor que 3 caracteres", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "fulano@gmail.com",
        name: "Fu",
        password: "123456",
      };

      await userBusiness.signup(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe(
        "Parâmetro 'name' precisa ter no mínimo 3 caracteres."
      );
    }
  });

  test("Um erro é retornado quando o password é menor que 6 caracteres", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "fulano@gmail.com",
        name: "Fulano",
        password: "1234",
      };

      await userBusiness.signup(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe(
        "Campo 'password' precisa ter no mínimo 6 caracteres."
      );
    }
  });

  test("Um erro é retornado quando o email tem um formato invalido", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "fulanogmail.com",
        name: "Fulano",
        password: "123456",
      };

      await userBusiness.signup(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe(
        "Por favor verifique se o formato do email está correto."
      );
    }
  });

  test("Um erro é retornado quando o email já existir no cadastro", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "igor@gmail.com",
        name: "Fulano",
        password: "123456",
      };

      await userBusiness.signup(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("Este email já está sendo usado.");
    }
  });

  test("Um erro é retornado quando já existir um nome igual cadastrado", async () => {
    expect.assertions(2);

    try {
      const input: ISignupInputDTO = {
        email: "igor22@gmail.com",
        name: "igor",
        password: "123456",
      };

      await userBusiness.signup(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("Este nome já está sendo usado, por favor insira seu nome completo.");
    }
  });

  // Erros da requisição: login
  test("Um erro é retornado quando tentar realizar login com email com formato invalido", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "fulanogmail.com",
        password: "123456",
      };

      await userBusiness.login(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe(
        "Por favor verifique se o formato do email está correto."
      );
    }
  });

  test("Um erro é retornado quando o password é menor que 6 caracteres", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "fulano@gmail.com",
        password: "1234",
      };

      await userBusiness.login(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe(
        "Campo 'password' precisa ter no mínimo 6 caracteres."
      );
    }
  });

  test("Um erro é retornado quando o email não existir no cadastro", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "fulano@gmail.com",
        password: "123456",
      };

      await userBusiness.login(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Este email ainda não foi cadastrado.");
    }
  });

  test("Um erro é retornado quando o password for incorreto", async () => {
    expect.assertions(2);

    try {
      const input: ILoginInputDTO = {
        email: "usuario@gmail.com",
        password: "passwordincorreto",
      };

      await userBusiness.login(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Senha inserida está incorreta.");
    }
  });

  // Erros da requisição: getAllOrders
  test("Deve retornar um erro quando inserimos um token errado na função getAllOrders", async () => {
    expect.assertions(2);

    try {
      const token = "token-mock-errado";

      await userBusiness.getAllOrders(token);
    } catch (error: any) {
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe("Token inválido");
    }
  });

  // Erros da requisição: getOrderDetails
  test("Deve retornar um erro quando tentamos buscar os produtos de um pedido passando um id de pedido errado", async () => {
    expect.assertions(2);

    try {
      const token = "token-mock-novo";
      const orderId = "id-errado";

      const input = { token, orderId };

      await userBusiness.getOrderDetails(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Não existe um pedido com este id.");
    }
  });

  test("Deve retornar um erro quando inserimos um token errado na função getOrderDetails", async () => {
    expect.assertions(2);

    try {
      const token = "token-mock-errado";
      const orderId = "id-mock";

      const input = { token, orderId };

      await userBusiness.getOrderDetails(input);
    } catch (error: any) {
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe("Token inválido");
    }
  });
});
