import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../authService/auth-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-component',
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './auth-component.html',
  styleUrl: './auth-component.css',
})
export class AuthComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // this.loginForm.valueChanges.subscribe((val) => console.log('Login form changed:', val));
    // this.signupForm.valueChanges.subscribe((val) => console.log('Signup form changed:', val));
  }

  loginMessage: string = '';

  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log('Submitting login data:', this.loginForm.value); // log form data
      this.api.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('User', res.token);
          this.api.setUser(res.user.name);
          this.api.setEmail(res.user.email);
          this.api.setToken(res.token);
          this.api.setId(res.user.id);
          this.api.setRole(res.user.role);
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.loginForm.reset();
          if (res.user.role == 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user']);
          }
        },
        error: (err) => {
          this.snackBar.open('Login failed. Please try again.', 'Close', { duration: 3000 });
          console.error('Login error:', err);
        },
      });
    }
  }

  onSignupSubmit() {
    if (this.signupForm.valid) {
      this.api.signup(this.signupForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('User registered successfully!', 'Close', { duration: 3000 });
          this.signupForm.reset();
        },
        error: (err) => {
          this.snackBar.open('Signup failed. Try again.', 'Close', { duration: 3000 });
          console.error('Signup error:', err);
        },
      });
    }
  }
}
