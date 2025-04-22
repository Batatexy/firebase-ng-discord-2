import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigurationsService } from './_old_services/configurations.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private getConfigurationsService: ConfigurationsService, private translate: TranslateService) {
    this.translate.addLangs(['pt-BR', 'en-US']);
    this.translate.setDefaultLang('pt-BR');
    this.translate.use('pt-BR');
  }

  ngOnInit() {
    if (this.getConfigurationsService.getThemeLocalStorage()) {
      this.getConfigurationsService.switchTheme("0");
    }

    this.getConfigurationsService.selectedLanguage$.subscribe({
      next: (language) => {
        this.translate.use(language);
      }
    });
  }


}
