import {
    ILoginInputDTO,
    ILoginOutputDTO,
    ISignupOutputDTO,
    ITokenPayload,
    User,
  } from "./../models/User";
  import { UserDatabase } from "../database/UserDatabase";
  import { ConflictError } from "../errors/ConflictError";
  import { ParamsError } from "../errors/ParamsError";
  import { UnprocessableError } from "../errors/UnprocessableError";
  import { ISignupInputDTO } from "../models/User";
  import { Authenticator } from "../services/Authenticator";
  import { HashManager } from "../services/HashManager";
  import { IdGenerator } from "../services/IdGenerator";
  import { AuthenticationError } from "../errors/AuthenticationError";
import { AuthorizationError } from "../errors/AuthorizationError";
import { NotFoundError } from "../errors/NotFoundError";
import { IOrderDetailsInputDTO, IOrderDetailsOutputDB } from "../models/Product";
  
  export class UserBusiness {
    constructor(
      private userDatabase: UserDatabase,
      private idGenerator: IdGenerator,
      private hashManager: HashManager,
      private authenticator: Authenticator
    ) {}
  
    public signup = async (input: ISignupInputDTO) => {
      const { name, email, password } = input;
  
      if (!name) {
        throw new ParamsError(
          "Necessário preencher o campo 'name'"
        );
      }

      if (!email) {
        throw new ParamsError(
          "Necessário preencher o campo 'email'"
        );
      }

      if (!password) {
        throw new ParamsError(
          "Necessário preencher o campo 'password'"
        );
      }
  
      if (typeof name !== "string") {
        throw new UnprocessableError(
          "Parâmetro 'name' precisa ser do tipo string."
        );
      }
  
      if (name.length < 3) {
        throw new UnprocessableError(
          "Parâmetro 'name' precisa ter no mínimo 3 caracteres."
        );
      }
  
      if (typeof email !== "string") {
        throw new UnprocessableError("Por favor verifique se o formato do email está correto..");
      }
  
      if (
        !email.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ) {
        throw new UnprocessableError("Por favor verifique se o formato do email está correto.");
      }
  
      if (typeof password !== "string") {
        throw new UnprocessableError(
          "Parâmetro 'password' precisa ser do tipo string."
        );
      }
  
      if (password.length < 6) {
        throw new UnprocessableError(
          "Campo 'password' precisa ter no mínimo 6 caracteres."
        );
      }
  
      const emailExists = await this.userDatabase.findByEmail(email);
  
      if (emailExists) {
        throw new ConflictError("Este email já está sendo usado.");
      }
  
      const nameExists = await this.userDatabase.findByname(name);
  
      if (nameExists) {
        throw new ConflictError("Este nome já está sendo usado, por favor insira seu nome completo.");
      }

      const id = this.idGenerator.generate();
  
      const hashedPassword = await this.hashManager.hash(password);
  
      const user = new User(id, name, email, hashedPassword);
  
      await this.userDatabase.createUser(user);
  
      const payload: ITokenPayload = {
        id: user.getId(),
        name: user.getName()
      };
  
      const token = this.authenticator.generateToken(payload);
  
      const response: ISignupOutputDTO = {
        message: "Cadastro realizado com sucesso.",
        token,
      };
  
      return response;
    };
  
    public login = async (input: ILoginInputDTO) => {
      const { email, password } = input;
  
      if (!email) {
        throw new ParamsError(
          "Necessário preencher o campo 'email'"
        );
      }

      if (!password) {
        throw new ParamsError(
          "Necessário preencher o campo 'password'"
        );
      }
  
      if (typeof email !== "string") {
        throw new UnprocessableError("Por favor verifique se o formato do email está correto.");
      }
  
      if (typeof password !== "string") {
        throw new UnprocessableError("Parâmetro 'password' inválido");
      }
  
      if (password.length < 6) {
        throw new UnprocessableError(
          "Campo 'password' precisa ter no mínimo 6 caracteres."
        );
      }
  
      if (
        !email.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ) {
        throw new UnprocessableError("Por favor verifique se o formato do email está correto.");
      }
  
      // Verificação se existe um usuário com este email
      const userExists = await this.userDatabase.findByEmail(email);
  
      if (!userExists) {
        throw new AuthenticationError("Este email ainda não foi cadastrado.");
      }

      const isPasswordCorrect = await this.hashManager.compare(
        password,
        userExists.getPassword()
      );
  
      if (!isPasswordCorrect) {
        throw new AuthenticationError("Senha inserida está incorreta.");
      }
  
      const payload: ITokenPayload = {
        id: userExists.getId(),
        name: userExists.getName()
      };
  
      const token = this.authenticator.generateToken(payload);
  
      const response: ILoginOutputDTO = {
        message: "Login realizado com sucesso",
        token,
      };
  
      return response;
    };

    public getAllOrders = async (token: string) => {
  
      if (!token) {
        throw new AuthenticationError("Necessário enviar um token");
      }
  
      const tokenData = this.authenticator.getTokenPayload(token);
  
      if (!tokenData) {
        throw new AuthorizationError("Token inválido");
      }

      const orderHistory = await this.userDatabase.getAllOrders();
  
      const response = {
        orderHistory,
      };
  
      return response;
    };

    public getOrderDetails = async (input: IOrderDetailsInputDTO) => {

      const { token, orderId } = input

      if(!orderId || orderId === ':orderId') {
        throw new ParamsError('Necessário enviar um id do pedido')
      }

      if (!token) {
        throw new AuthenticationError("Necessário enviar um token");
      }
  
      const tokenData = this.authenticator.getTokenPayload(token);
  
      if (!tokenData) {
        throw new AuthorizationError("Token inválido");
      }

      const orderDetails: IOrderDetailsOutputDB[] | undefined = await this.userDatabase.getOrderDetails(orderId);

      if(!orderDetails) {
        throw new NotFoundError('Não existe um pedido com este id.')
      }
  
      const response = {
        orderDetails
      };
  
      return response;

    }
  }
  
  