import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthResponse } from './auth.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  authForm: FormGroup;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  initForm() {
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    if (!this.authForm.valid)
      return;

    const email = this.authForm.get('email').value;
    const password = this.authForm.get('password').value;
    console.log(this.authForm.value);

    let authObs: Observable<AuthResponse>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    //Auth Observable
    authObs.subscribe(
      (response: AuthResponse) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorRes => {
        console.log('Logging error from Auth Component: ', errorRes);
        this.error = errorRes;
        this.isLoading = false;
      }
    )
    this.authForm.reset();
  }

  onHandleError(){
    this.error = null;
  }
}
