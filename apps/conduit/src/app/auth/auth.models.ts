import { User } from '../shared/shared.models';

export interface AuthContext {
  user: User;
  errors: string[];
}

export interface Errors {
  [key: string]: string;
}
