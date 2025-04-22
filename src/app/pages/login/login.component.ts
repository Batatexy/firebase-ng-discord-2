import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  //Campos do formulário
  loginFormGroup: FormGroup;
  userEmailModel: string = "";
  userPasswordModel: string = "";

  constructor(private getClientService: ClientService) {
    this.loginFormGroup = new FormGroup({
      userEmail: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(128), Validators.email]),
      userPassword: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(256)]),
    });
  }

  ngOnInit() {
    //this.getClientService.tryLogin();
  }

  public submitLogin() {
    //Validação padrão dos campos
    if (!this.loginFormGroup.invalid) {
      this.getClientService.authenticateLogin(this.userEmailModel, this.userPasswordModel);
    }
    else {
      alert("Insert a valid email and password!");
    }
  }

}
