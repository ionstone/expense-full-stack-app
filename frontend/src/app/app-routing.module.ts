import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './app/auth.guard';



const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full'},

  {path:'login',component:LoginComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

    {path:'register',component:RegistrationComponent},

  // {path:'dashboard',component:DashboardComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
