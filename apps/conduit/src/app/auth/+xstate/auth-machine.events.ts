import { User, UserResponse } from '../../shared/shared.models';
import { Errors } from '../auth.models';

export class SignIn {
  readonly type = 'SIGNIN';
  constructor(public username: string, public password: string) {}
}

export class SignInFail {
  readonly type = 'SIGNIN_FAILURE';
  constructor(public errors: Errors) {}
}

export class SignInSuccess {
  readonly type = 'SIGNIN_SUCCESS';
  constructor(public response: UserResponse) {}
}

export class SignUp {
  readonly type = 'SIGNUP';
  constructor(
    public username: string,
    public email: string,
    public password: string
  ) {}
}

export class SignUpFail {
  readonly type = 'SIGNUP_FAILURE';
  constructor(public errors: Errors) {}
}

export class SignUpSuccess {
  readonly type = 'SIGNUP_SUCCESS';
  constructor(public response: UserResponse) {}
}

export class FetchUserFail {
  readonly type = 'FETCH_USER_FAILURE';
  constructor(public errors: Errors) {}
}

export class FetchUserSuccess {
  readonly type = 'FETCH_USER_SUCCESS';
  constructor(public user: User) {}
}

export class UpdateUser {
  readonly type = 'UPDATE_USER';
  constructor(public user: User) {}
}

export class UpdateUserSuccess {
  readonly type = 'UPDATE_USER_SUCCESS';
  constructor(public user: User) {}
}

export class UpdateUserFailure {
  readonly type = 'UPDATE_USER_FAILURE';
  constructor(public user: User) {}
}

export class Logout {
  readonly type = 'LOGOUT';
}

export type AuthMachineEvent =
  | SignIn
  | SignInFail
  | SignInSuccess
  | SignUp
  | SignUpFail
  | SignUpSuccess
  | FetchUserFail
  | FetchUserSuccess
  | UpdateUserFailure
  | UpdateUserSuccess
  | UpdateUser
  | Logout;
