import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  // Existing properties
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  // Add these new properties
  isLoading: boolean = false;

  // Password validation states
  passwordCriteria = {
    minLength: false,
    upperCase: false,
    lowerCase: false,
    specialChar: false,
    number: false,
  };

  constructor(private router: Router, private http: HttpClient) {}

  // Validate password dynamically
  validatePassword(password: string) {
    this.passwordCriteria.minLength = password.length >= 8;
    this.passwordCriteria.upperCase = /[A-Z]/.test(password);
    this.passwordCriteria.lowerCase = /[a-z]/.test(password);
    this.passwordCriteria.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordCriteria.number = /\d/.test(password);
  }

  onRegister(form: any) {
    if (!form.valid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    if (Object.values(this.passwordCriteria).some((condition) => !condition)) {
      this.errorMessage = 'Password does not meet the required criteria.';
      return;
    }

    // Add loading state
    this.isLoading = true;

    // Prepare data for API call
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    // Make API call to the backend
    this.http.post('http://localhost:3000/register', userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).subscribe({
      next: (response: any) => {
        // Handle success response
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.isLoading = false;
    
        // Navigate to the login or dashboard page
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        // Check for specific error code (409 Conflict)
        if (error.status === 409) {
          this.errorMessage = 'This email is already registered. Please use a different email.';
        } else {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
        this.successMessage = '';
        this.isLoading = false;
      }
    });
    
    
  }
}
