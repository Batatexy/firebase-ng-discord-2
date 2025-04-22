import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-common-router-button',
  imports: [CommonModule, RouterLink],
  templateUrl: './common-router-button.component.html',
  styleUrl: './common-router-button.component.scss'
})
export class CommonRouterButtonComponent {

  @Input() className: string = "";
  @Input() router: string = "";
  @Input() routes: Array<string> = [];
  @Input() activeClass: string = "";


  constructor(private GetRouter: Router) { }

  public isActive(): string {
    let returnActive: string = "";
    this.routes.forEach(route => {
      if ((route != "/" && this.GetRouter.url.startsWith(route)) || route == this.GetRouter.url) {
        returnActive = this.activeClass;
      }
    });

    return returnActive;
  }
}
