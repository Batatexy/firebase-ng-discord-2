import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonRouterButtonComponent } from '../../components/common-router-button/common-router-button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, CommonRouterButtonComponent, TranslatePipe],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
