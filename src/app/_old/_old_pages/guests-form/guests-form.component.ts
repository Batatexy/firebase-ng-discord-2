import { Component } from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import { Guest } from '../../models/guest';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-guests-form',
  imports:
    [
      CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective
    ],
  templateUrl: './guests-form.component.html',
  styleUrl: './guests-form.component.scss'
})
export class GuestsFormComponent {

  //Campos do formulário
  guestFormGroup: FormGroup;
  nameModel: string = "";
  emailModel: string = "";
  phoneModel: string = "";
  documentModel: string = "";

  //Edição de Hóspede
  id?: string;
  guest?: Guest;

  guests: Array<Guest> = [];

  constructor(private getGuestsService: GuestsService, private getActivatedRoute: ActivatedRoute, private getRouter: Router) {
    this.guestFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      document: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    });
  }

  ngOnInit() {
    console.clear();
    this.id = String(this.getActivatedRoute.snapshot.paramMap.get("id"));

    if (this.id != "null") {
      this.getGuestsService.getGuestByID(this.id).subscribe({
        next: (guest) => {
          this.guest = guest[0];
        },
        complete: () => {
          if (this.guest) {
            //this.guestFormGroup.patchValue({ ...this.guest });
            this.nameModel = this.guest.name;
            this.emailModel = this.guest.email;
            this.phoneModel = this.guest.phone;
            this.documentModel = this.guest.document;
          }
        },
        error: () => { alert("Erro ao requisitar Hóspede"); }
      });
    }
  }

  public submitGuest() {
    //Validação padrão dos campos
    if (!this.guestFormGroup.invalid) {
      //Validação de Dados, verificar se Email, CPF já estão registrados
      let validation: boolean = false;

      this.getGuestsService.getGuestByEmail(this.emailModel).subscribe({
        next: (guest) => {
          //Se existir algum Hóspede com o mesmo email, mudar para false, senão, mudar para true
          if (guest[0]) {
            if (guest[0].id == this.guest?.id) {
              validation = true;
            }
            else {
              alert("Este email já está cadastrado");
              validation = false;
            }
          }
          else {
            validation = true;
          }
        },

        complete: () => {
          if (validation) {
            this.getGuestsService.getGuestByDocument(this.documentModel).subscribe({
              next: (guest) => {
                //Se existir algum Hóspede com o mesmo CPF, mudar para false, senão, mudar para true
                if (guest[0]) {
                  if (guest[0].id == this.guest?.id) {
                    validation = true;
                  }
                  else {
                    alert("Este CPF já está cadastrado");
                    validation = false;
                  }
                }
                else {
                  validation = true;
                }
              },

              complete: () => {
                if (validation) {
                  let newGuest: Guest =
                  {
                    name: this.nameModel,
                    email: this.emailModel,
                    phone: this.phoneModel,
                    document: this.documentModel,
                  };

                  //Edição de Dados de um Hóspede
                  if (this.guest) {
                    newGuest.id = this.guest.id;
                    this.getGuestsService.editGuest(newGuest).subscribe({
                      complete: () => {
                        alert("Hóspede Editado!");
                        this.getRouter.navigate(['/guests']);

                      },
                      error: () => { alert("Erro ao editar Hóspede"); }
                    });
                  }
                  //Novo Hóspede
                  else {
                    //Requisição de Hóspedes
                    this.getGuestsService.getGuests().subscribe({
                      next: (guests) => {
                        this.guests = guests;
                      },
                      complete: () => {
                        this.getGuestsService.addGuest(newGuest).subscribe({
                          complete: () => {
                            alert("Hóspede Registrado!");

                            this.nameModel = "";
                            this.emailModel = "";
                            this.phoneModel = "";
                            this.documentModel = "";
                          },
                          error: () => { alert("Erro ao Registrar Hóspede"); }
                        });
                      },
                      error: () => { alert("Erro ao requisitar Hóspedes"); }
                    });
                  }
                }
              },
              error: () => { alert("Erro ao validar CPF"); }
            });
          }
        },
        error: () => { alert("Erro ao validar email"); }
      });
    }
    else {
      alert("Preencha os campos para registrar o Hóspede");
    }
  }








  public phone$ = new Observable<string>((observer) => {
    let previousPhone: string = this.phoneModel;
    setInterval(() => {
      if (this.phoneModel !== previousPhone) {
        observer.next(this.phoneModel);
        previousPhone = this.phoneModel;
      }
    },);
  });

  public document$ = new Observable<string>((observer) => {
    setInterval(() => {
      observer.next(this.documentModel);
    },);
  });
}