import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  //Campos do formulário
  registerFormGroup: FormGroup;
  userTagModel: string = "";
  userNameModel: string = "";
  userEmailModel: string = "";
  userPasswordModel: string = "";

  constructor(private getClientService: ClientService) {
    this.registerFormGroup = new FormGroup({
      userTag: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
      userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(48)]),
      userEmail: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(128), Validators.email]),
      userPassword: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(256)]),
    });
  }

  ngOnInit() {
    //this.getClientService.tryLogin();
  }

  public submitRegister() {
    //Validação padrão dos campos
    if (!this.registerFormGroup.invalid) {
      this.getClientService.authenticateRegister(this.userEmailModel, this.userPasswordModel, this.userTagModel, this.userNameModel);
    }
    else {
      alert("Insert valid information");
    }
  }

}
