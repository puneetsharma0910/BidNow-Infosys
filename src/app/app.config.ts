import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuctionDetailComponent } from './auction-detail/auction-detail.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminDashboardChartsComponent } from './admin-dashboard-charts/admin-dashboard-charts.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AboutUsComponent } from './about-us/about-us.component';
import { SupportComponent } from './support/support.component';
import { LegalComponent } from './legal/legal.component';
import { SellerLoginComponent } from './seller-login/seller-login.component';
import { DisputesComponent } from './disputes/disputes.component';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'auction-detail', component: AuctionDetailComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'auction-detail/:id', component: AuctionDetailComponent },
  { path: 'admin-dashboard/charts', component: AdminDashboardChartsComponent },
  { path: 'user-detail/:id', component: UserDetailComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'support', component: SupportComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'seller-login', component: SellerLoginComponent },
  { path: 'disputes', component: DisputesComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    provideAnimations(),
    FormsModule,
    provideHttpClient(),
    CommonModule  
  ],
};
