import { Component, Input } from '@angular/core';
import { BreadCrumbComponent } from '../bread-crumb/bread-crumb.component';
import { Movie } from '../../models/movie';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { BadgeComponent } from "../badge/badge.component";
import { GeneralService } from '../../services/general.service';
import { HeaderTranslationsComponent } from '../header-translations/header-translations.component';

@Component({
  selector: 'app-header',
  imports: [BreadCrumbComponent, LanguageSelectorComponent, BadgeComponent, HeaderTranslationsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private getMoviesService: MoviesService, private getGeneralService: GeneralService) { }

  title?: string = "aaa";

  public setTitle(title: string) {
    this.title = title;
  }

  public getMovie(): Movie | undefined {
    return this.getMoviesService.getMovie();
  }

  public divideByTwo(number: number | undefined): number {
    return this.getGeneralService.divideByTwo(number);
  }
}
