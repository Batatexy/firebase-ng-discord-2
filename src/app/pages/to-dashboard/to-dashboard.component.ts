import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-to-dashboard',
  imports: [],
  templateUrl: './to-dashboard.component.html',
  styleUrl: './to-dashboard.component.scss'
})
export class ToDashboardComponent {
  constructor(private getRouter: Router) {
    this.getRouter.navigate(['/dashboard']);
  }
}
