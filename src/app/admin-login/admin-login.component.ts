import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [RouterModule, FormsModule, CommonModule],
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
    email: string = '';
    password: string = '';
    errorMessage: string = '';
    isLoading: boolean = false;
    showPassword: boolean = false;

    constructor(private router: Router) {}

    onAdminLogin(form: NgForm) {
        if (!form.valid) {
            this.errorMessage = 'Please fill out the form correctly.';
            return;
        }

        this.isLoading = true;

        // Simulate authentication
        setTimeout(() => {
            if (this.email === 'admin@example.com' && this.password === 'admin123') {
                this.router.navigate(['/admin-dashboard']); // Navigate to admin dashboard
            } else {
                this.errorMessage = 'Invalid admin credentials.';
            }
            this.isLoading = false;
        }, 1500);
    }
 
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
}
