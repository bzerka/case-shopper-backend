import { ITokenPayload } from "../../src/services/Authenticator";

export class AuthenticatorMock {
  public generateToken = (payload: ITokenPayload): string => {
    switch (payload.id) {
      case 'id-mock':
        return "token-mock-normal";
      default:
        return "token-mock-normal"
    }
  };

  public getTokenPayload = (token: string): ITokenPayload | null => {
    switch (token) {
      case "token-mock-normal":
        const normalPayload: ITokenPayload = {
          id: "id-mock",
          name: "name-mock"
        };

        return normalPayload;

      case "token-mock-novo":
        const wrongPayload: ITokenPayload = {
          id: "id-novo",
          name: "name-mock"
        };
        return wrongPayload
      default:
        return null
    }
  };
}
