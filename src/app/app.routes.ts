import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ToDashboardComponent } from './pages/to-dashboard/to-dashboard.component';
export const routes: Routes =
  [
    {
      path: "",
      component: LayoutComponent,
      children:
        [
          {
            path: "",
            component: ToDashboardComponent
          },
          {
            path: "dashboard",
            component: DashboardComponent
          },
          {
            path: "dashboard/:chatID",
            component: DashboardComponent
          }
        ],
    }
    ,
    {
      path: "login",
      component: LoginComponent,
    }
    ,
    {
      path: "register",
      component: RegisterComponent,
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
    },
  ];

