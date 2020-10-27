import { User } from '../../shared/shared.models';

export interface AuthMachineSchema {
  states: {
    authorized: {};
    unauthorized: {};
    signing_in: {};
    signing_up: {};
    errors: {};
    updating: {};
  };
}

export interface AuthMachineContext {
  user: User;
  errors: string[];
}
