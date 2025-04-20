import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent //implements OnInit 
{
  //Campos do formulário
  loginFormGroup: FormGroup;
  emailModel: string = "";
  passwordModel: string = "";

  constructor(private getUsers: UsersService, private getActivatedRoute: ActivatedRoute, private getRouter: Router) {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(64), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]),
    });
  }















  public submitLogin() {
    //Validação padrão dos campos
    if (!this.loginFormGroup.invalid) {

      const cryptedEmail = this.getUsers.encryptText(this.emailModel);
      const cryptedPassword = this.getUsers.encryptText(this.passwordModel);

      this.getUsers.getUserByEmailAndPassword$(this.emailModel, this.passwordModel).subscribe({
        next: (user) => {
          if (user[0]) {

          }
          else {
            alert("Invalid");
          }
        },

        complete: () => {
        }
      });
    }
  }






}
