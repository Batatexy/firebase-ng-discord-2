import { Injectable } from '@angular/core';
import { Language } from '../models/language';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  constructor() { }

  //Falso = Claro
  private theme: string = "light";
  private allLanguages: Array<Language> =
    [
      //Primeira linguagem será a padrão
      {
        flag: "fi-br",
        language: "pt-BR",
        language_name: "Português (Brasil)"
      },
      {
        flag: "fi-us",
        language: "en-US",
        language_name: "English (United States)"
      },
      {
        flag: "fi-cn",
        language: "zh-CN",
        language_name: "简体中文 (中国)"
      },
    ];

  private selectedLanguage: string = this.allLanguages[0].language;

  public selectedLanguage$ = new Observable<string>((observer) => {
    let previousLanguage: string = this.selectedLanguage;
    setInterval(() => {
      if (this.selectedLanguage !== previousLanguage) {
        observer.next(this.selectedLanguage);
        previousLanguage = this.selectedLanguage;
        document.getElementById("search-movies")?.focus();
      }
    },);
  });

  public switchTheme(seconds: string): void {
    let body = document.body.style;
    body.setProperty("--transition-theme-time", seconds);

    if (this.theme == "dark") {

      this.theme = "light";
      body.setProperty("--background-default-color", "#EFEFEF");
      body.setProperty("--foreground-default-color", "white");
      body.setProperty("--text-default-color", "black");
      body.setProperty("--searchbar-text-color", "#4B5563");
    }
    else {
      this.theme = "dark";
      body.setProperty("--background-default-color", "rgb(41, 41, 41)");
      body.setProperty("--foreground-default-color", "rgb(57, 57, 57)");
      body.setProperty("--text-default-color", "white");
      body.setProperty("--searchbar-text-color", "white");
    }

    this.setThemeLocalStorage(this.theme);
  }

  public getTheme(): string {
    return this.theme;
  }

  public getSelectedLanguage(): string {
    return this.selectedLanguage;
  }

  public setSelectedLanguage(selectedLanguage: string): void {
    this.selectedLanguage = selectedLanguage;
  }

  public setThemeLocalStorage(theme: string): void {
    localStorage.setItem("userTheme", JSON.stringify(theme));
  }

  public getThemeLocalStorage(): boolean | null {
    let theme = localStorage.getItem("userTheme");
    if (theme == null) {
      return false;
    }
    return JSON.parse(theme);
  }

  public getAllLanguages(): Array<Language> {
    return this.allLanguages;
  }

}
