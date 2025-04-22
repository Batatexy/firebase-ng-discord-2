import { Component } from '@angular/core';
import { ConfigurationsService } from '../../services/configurations.service';
import { CommonModule } from '@angular/common';
import { Language } from '../../models/language';
import { MoviesService } from '../../services/movies.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  constructor(private getConfigurationsService: ConfigurationsService, private getMoviesService: MoviesService) { }

  public switchTheme(): void {
    this.getConfigurationsService.switchTheme("0.3s");
  }

  public getTheme(): string {
    return this.getConfigurationsService.getTheme();
  }

  public getSelectedLanguage(): string {
    return this.getConfigurationsService.getSelectedLanguage();
  }

  public setSelectedLanguage(language: string): void {
    if (language != this.getConfigurationsService.getSelectedLanguage()) {
      this.getConfigurationsService.setSelectedLanguage(language);
    }

  }

  public getAllLanguages(): Array<Language> {
    return this.getConfigurationsService.getAllLanguages();
  }

  // public getActualLanguage(): Observable<string> {
  //   return this.getConfigurationsService.getSelectedLanguage();
  // }


}
