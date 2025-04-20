import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
