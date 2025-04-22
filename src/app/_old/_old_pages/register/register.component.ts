import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ConfigurationsService } from '../../services/configurations.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  //Registro de Usuário
  newRegister: FormGroup;
  newRegisterInvalid: boolean = false;

  nameModel: string = '';
  emailModel: string = '';
  passwordModel: string = '';

  constructor(private getUserService: UserService, private getConfigurationsService: ConfigurationsService,) {

    this.newRegister = new FormGroup({
      name: new FormControl('', [Validators.minLength(3), Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(3), Validators.required]),
    });
  }

  ngOnInit() {
    //Validação dos campos de Register
    this.newRegister.get('name')?.valueChanges.subscribe({
      next: (val) => {
        if (this.newRegister.get('name')?.errors) {
          this.newRegisterInvalid = true;
        } else {
          this.newRegisterInvalid = false;
        }
      },
    });
  }

  submitRegister() {
    if (!this.newRegister.invalid) {
      let newUser = this.newRegister.value;

      newUser.id = 2;
      newUser.favorites = [];

      this.getUserService.postUser(newUser).subscribe({
        next: (val) => console.log(val)
      });
    }
  }















}
