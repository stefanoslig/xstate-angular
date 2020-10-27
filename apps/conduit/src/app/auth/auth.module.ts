import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { RegisterComponent } from './register/register.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { XstateAngular } from '@xstate-angular/xstate-angular';
import { GLOBAL_XSTATE_ANGULAR } from './+xstate/auth-machine.config';
import { AuthMachineContext, AuthMachineSchema } from './+xstate/auth-machine.schema';
import { AuthMachineEvent } from './+xstate/auth-machine.events';

const authRouting = RouterModule.forChild([
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
]);

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, authRouting, SharedModule],
  providers: [
    AuthService,
    TokenInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    { provide: GLOBAL_XSTATE_ANGULAR, useFactory: () => new XstateAngular<AuthMachineContext, AuthMachineSchema, AuthMachineEvent>() },
  ],
  declarations: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
