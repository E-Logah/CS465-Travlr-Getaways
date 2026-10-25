import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

// HTML login form for the admin site
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  formError = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onLoginSubmit(): void {
    this.submitted = true;
    this.formError = '';
    if (this.loginForm.invalid) {
      this.formError = 'Please enter a valid email and password.';
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authenticationService.login(email, password).subscribe({
      next: () => this.router.navigate(['']),
      error: (err) => {
        console.error('Login failed:', err);
        this.formError = err.status === 401
          ? 'Incorrect email or password.'
          : 'Login failed. Is the API running?';
      }
    });
  }
}
