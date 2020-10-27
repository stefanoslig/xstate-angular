import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  AbstractControl,
  FormBuilder,
} from '@angular/forms';

import { AuthMachineFacade } from '../+xstate/auth-machine.facade';
import { SignUp } from '../+xstate/auth-machine.events';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  emailCtr: AbstractControl;
  usernameCtr: AbstractControl;
  passwordCtr: AbstractControl;
  isSignUp$ = this.authMachineFacade.isSignUp$;
  errors$ = this.authMachineFacade.errors$;

  constructor(
    private fb: FormBuilder,
    private authMachineFacade: AuthMachineFacade
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: [{ value: '', disabled: false }, [Validators.required]],
      email: [
        { value: '', disabled: false },
        [Validators.email, Validators.required],
      ],
      password: [{ value: '', disabled: false }, [Validators.required]],
    });
    this.usernameCtr = this.registerForm.get('username');
    this.emailCtr = this.registerForm.get('email');
    this.passwordCtr = this.registerForm.get('password');
  }

  submitForm() {
    this.authMachineFacade.send(
      new SignUp(
        this.usernameCtr.value,
        this.emailCtr.value,
        this.passwordCtr.value
      )
    );
  }
}
