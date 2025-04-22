import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  //Dividir um número por 2
  public divideByTwo(number: number | undefined): number {
    if (number) {
      return number / 2;
    }

    return 0;
  }

  //Gerar 1 zero antes de um número
  public createZeroBeforeNumbers(number: number,): string {
    let numberToString: string = String(number);

    if (number < 10) {
      numberToString = "0" + number;
    }

    return numberToString;
  }
}
