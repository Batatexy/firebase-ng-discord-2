import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [{
    path: "",
    component: LayoutComponent,
    children:
        [
            {
                path: "",
                component: DashboardComponent
            },
            {
                path: "register",
                component: RegisterComponent,
            },
            {
                path: "login",
                component: LoginComponent,
            }
        ],
}
    ,
{
    path: "**",
    component: LayoutComponent,
    children:
        [
            {
                path: "",
                component: NotFoundComponent,
            },
        ]
},];
