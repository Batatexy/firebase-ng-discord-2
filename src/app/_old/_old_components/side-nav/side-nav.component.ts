import { Component } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { CommonRouterButtonComponent } from "../common-router-button/common-router-button.component";
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-side-nav',
  imports: [AvatarComponent, CommonRouterButtonComponent, CommonModule, TranslatePipe],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {


}
