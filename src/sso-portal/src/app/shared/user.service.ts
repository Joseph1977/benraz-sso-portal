import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { AuthService } from '@josephbenraz/npm-authorization';

export class User {
  isAuthenticated: boolean;
  id: string;
  email: string;
  name: string;
  isPasswordExpired?: boolean;
  roles: string[];
  claims: string[];

  static createDefault(): User {
    return {
      isAuthenticated: false,
      id: null,
      email: null,
      name: null,
      roles: [],
      claims: []
    };
  }
}

@Injectable()
export class UserService {
  constructor(private authService: AuthService) {
  }

  public createUserFromToken(accessToken: string) {
    return this.createUser(accessToken);
  }

  public getUser(): User {
    const user = this.createCurrentTokenUser();
    return user;
  }

  public isAuthorized(authorizeRoles: string[]) {
    if (!authorizeRoles || !(authorizeRoles instanceof Array)) {
      return false;
    }

    const user = this.createCurrentTokenUser();
    if (user && user.roles.some(x => authorizeRoles.some(y => x === y))) {
      return true;
    }

    return false;
  }

  private createCurrentTokenUser() {
    const accessToken = this.authService.getToken();
    return this.createUser(accessToken);
  }

  private createUser(accessToken: string): User {
    debugger
    const jwt = this.getDecodedAccessToken(accessToken);
    if (!jwt) {
      return User.createDefault();
    }

    return {
      isAuthenticated: true,
      id: jwt.userid,
      name: jwt.unique_name,
      email: jwt.email,
      isPasswordExpired: jwt.is_password_expired,
      roles: jwt.role instanceof Array ? jwt.role : [jwt.role],
      claims: jwt.claim instanceof Array ? jwt.claim : [jwt.claim]
    };
  }

  private getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode.jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}
