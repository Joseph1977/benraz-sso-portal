export class Policies {
  public static readonly PROFILE_SET_PASSWORD = 'profile-password-set';
}

export class Claims {
  public static readonly PROFILE_SET_PASSWORD = 'authorization-profile-password-set';
}

export class ValidationRules {
  public static readonly PASSWORD_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$';
  public static readonly PASSWORD_HINT =
    'Password must contain at least 8 characters, ' +
    'at least one non-alphanumeric character, ' +
    'at least one lowercase (\'a\'-\'z\'), ' +
    'at least one uppercase (\'A\'-\'Z\'), ' +
    'at least one digit (\'0\'-\'9\')';
}

export class SetPassword {
  code: string;
  newPassword: string;
}

export class Login {
  username: string;
  password: string;
  state: string;
}

export class LoginResult {
  userId?: string;
  accessToken: string;
  error: string;
  errorReasonCode?: AuthorizationFailedReasonCode;
  callbackUrl: string;
}

export enum AuthorizationFailedReasonCode {
  unknown = 1,
  invalidCredentials = 2,
  locked = 3,
  suspended = 4,
  emailUnconfirmed = 5
}

export class SignUp {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  state: string;
  sendConfirmationEmail: boolean;
}

export class SignUpResult {
  userId?: string;
}

export class SendConfirmationEmail {
  userId: string;
}

export class ConfirmEmail {
  userId: string;
  token: string;
}

export class ChangePassword {
  username: string;
  oldPassword: string;
  newPassword: string;
  state: string;
}

export class RestorePassword {
  username: string;
}

export class CreateMfaModel {
  userEmail: string;
  actionType: MfaCode;
  mode: MfaMode;
  applicationId: string;
}

export enum MfaCode {
  confirmEmail = 1,
  resetPassword = 2,
  action = 3
}

export enum MfaMode {
  email = 1,
  phone = 2
}

export class MfaData {
  expirationCountDown: string;
  mode: string;
  maskedTarget: string;
  accessToken: string;
  numberOfDigits: number;
}

export class GetTokenByMfaCodeModel {
  userEmail: string;
  actionType: MfaCode;
  applicationId: string;
  code: string;
}

export class MfaCodeToken {
  userId: string;
  accessToken: string;
  code: string;
}