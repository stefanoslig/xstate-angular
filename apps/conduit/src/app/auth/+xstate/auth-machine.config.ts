import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Machine, assign } from 'xstate';
import { environment } from '../../../environments/environment';
import { AuthMachineContext, AuthMachineSchema } from './auth-machine.schema';
import {
  AuthMachineEvent,
  SignInSuccess,
  SignInFail,
  SignUpSuccess,
  SignUpFail,
  SignIn,
  SignUp,
} from './auth-machine.events';
import { AuthService } from '../auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { XstateAngular } from 'xstate-angular';

export const GLOBAL_XSTATE_ANGULAR = new InjectionToken<
  XstateAngular<AuthMachineContext, AuthMachineSchema, AuthMachineEvent>
>('GLOBAL_XSTATE_ANGULAR');

export const initialContext: AuthMachineContext = {
  user: {
    email: '',
    token: '',
    username: '',
    bio: '',
    image: '',
  },
  errors: [],
};

@Injectable({ providedIn: 'root' })
export class AuthMachineService {
  constructor(
    private readonly authService: AuthService,
    private router: Router,
    @Inject(GLOBAL_XSTATE_ANGULAR)
    private xstateAngular: XstateAngular<
      AuthMachineContext,
      AuthMachineSchema,
      AuthMachineEvent
    >
  ) {
    this.authMachine.state$.subscribe((state) =>
      localStorage.setItem('authState', JSON.stringify(state))
    );
  }

  private authMachineConfig = Machine<
    AuthMachineContext,
    AuthMachineSchema,
    AuthMachineEvent
  >(
    {
      id: 'auth',
      initial: 'unauthorized',
      context: initialContext,
      states: {
        unauthorized: {
          entry: 'resetUser',
          on: {
            SIGNIN: 'signing_in',
            SIGNUP: 'signing_up',
          },
        },
        signing_in: {
          invoke: { src: 'signIn' },
          on: {
            SIGNIN_SUCCESS: { target: 'authorized', actions: 'assignUser' },
            SIGNIN_FAILURE: { target: 'errors', actions: 'assignErrors' },
          },
        },
        signing_up: {
          invoke: { src: 'signUp' },
          on: {
            SIGNUP_SUCCESS: { target: 'authorized', actions: 'assignUser' },
            SIGNUP_FAILURE: { target: 'errors', actions: 'assignErrors' },
          },
        },
        authorized: {
          entry: ['goToHomePage', 'assignUser'],
          on: {
            UPDATE_USER: 'updating',
            LOGOUT: { target: 'unauthorized', actions: 'logout' },
          },
        },
        errors: {
          on: {
            SIGNIN: 'signing_in',
            SIGNUP: 'signing_up',
          },
          exit: 'resetErrors',
        },
        updating: {},
      },
    },
    {
      actions: {
        resetUser: assign<AuthMachineContext, AuthMachineEvent>(() => ({
          user: initialContext.user,
        })),
        resetErrors: assign<AuthMachineContext, AuthMachineEvent>(() => ({
          errors: initialContext.errors,
        })),
        goToHomePage: (ctx: AuthMachineContext, event: AuthMachineEvent) =>
          this.router.navigateByUrl(''),
        assignUser: assign<AuthMachineContext, AuthMachineEvent>(
          (ctx, event) => ({
            user: (event as SignInSuccess).response.user,
          })
        ),
        assignErrors: assign<AuthMachineContext, AuthMachineEvent>(
          (_, event) => {
            const eventErrors = (event as SignInFail).errors;
            return {
              errors: Object.keys(eventErrors || {}).map(
                (key) => `${key} ${eventErrors[key]}`
              ),
            };
          }
        ),
        logout: () => {
          localStorage.setItem('authState', null);
          this.router.navigateByUrl('login');
        },
      },
      services: {
        signIn: (_, event: SignIn) =>
          this.authService
            .login({ email: event.username, password: event.password })
            .pipe(
              map((user) => new SignInSuccess(user)),
              catchError((result) => of(new SignInFail(result.error.errors)))
            ),
        signUp: (_, event: SignUp) =>
          this.authService
            .register({
              username: event.username,
              email: event.email,
              password: event.password,
            })
            .pipe(
              map((user) => new SignUpSuccess(user)),
              catchError((result) => of(new SignUpFail(result.error.errors)))
            ),
      },
    }
  );

  rehydratedState = JSON.parse(localStorage.getItem('authState'));

  authMachine = this.xstateAngular.useMachine(this.authMachineConfig, {
    devTools: !environment.production,
    state: this.rehydratedState,
  });
}
