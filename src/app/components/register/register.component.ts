import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private getUsers: UsersService) { }

  ngOnInit() {
    const email = localStorage.getItem('email') || '';
    const password = localStorage.getItem('password') || '';

    this.getUsers.getUserByEmailAndPassword$(email, password).subscribe((user) => {
      console.log(user);

      if (user) {
        this.getUsers.setUser(user[0]);
        console.log('User found:', user[0]);
        //Redirecionar para DashBoard
      }
      else {
        console.log('User not found');
        //Redirecionar para Login / Register
      }
    });
  }
}
