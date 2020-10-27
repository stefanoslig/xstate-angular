import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthMachineFacade } from '../+xstate/auth-machine.facade';
import { SignIn } from '../+xstate/auth-machine.events';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  emailCtr: AbstractControl;
  passwordCtr: AbstractControl;
  isSignIn$ = this.authMachineFacade.isSignIn$;
  errors$ = this.authMachineFacade.errors$;

  constructor(
    private fb: FormBuilder,
    private authMachineFacade: AuthMachineFacade
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [
        { value: '', disabled: false },
        [Validators.email, Validators.required],
      ],
      password: [{ value: '', disabled: false }, [Validators.required]],
    });
    this.emailCtr = this.loginForm.get('email');
    this.passwordCtr = this.loginForm.get('password');
  }

  submitForm() {
    this.authMachineFacade.send(
      new SignIn(this.emailCtr.value, this.passwordCtr.value)
    );
  }
}
