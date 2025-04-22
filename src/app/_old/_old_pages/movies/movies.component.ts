import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { MoviesService } from '../../services/movies.service';
import { WhiteCardComponent } from "../../components/white-card/white-card.component";
import { SearchAreaComponent } from "../../components/search-area/search-area.component";
import { CommonActionButtonComponent } from '../../components/common-action-button/common-action-button.component';
import { Movie } from '../../models/movie';
import { ConfigurationsService } from '../../services/configurations.service';
import { GeneralService } from '../../services/general.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-movies',
  imports:
    [
      MovieCardComponent, WhiteCardComponent, CommonModule,
      CommonActionButtonComponent, SearchAreaComponent, TranslatePipe
    ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {

  //Injeção de dependências: importar a classe GetMoviesService
  constructor(
    private getMoviesService: MoviesService, private getConfigurationsService: ConfigurationsService,
    private getGeneralService: GeneralService,
  ) { }

  ngOnInit(): void {
    //console.clear();

    this.getConfigurationsService.selectedLanguage$.subscribe({
      next: (language) => {
        console.log(language);
        this.setPopularMovies();
      }
    });

    if (this.getMoviesService.getRange() == this.getMoviesService.getRangeIncrease()) {
      this.setPopularMovies();
    }

  }

  public setPopularMovies() {
    this.getMoviesService.setMovies([], "popular");

    for (let page = 1; page <= this.getMoviesService.getPage("popular"); page++) {
      this.getMoviesService.getMovies$(page, this.getConfigurationsService.getSelectedLanguage(), "popular").subscribe({
        next: (res) => {
          this.getMoviesService.addMovies(res.results, "popular");
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.getMoviesByName();
          console.log("Filmes:", this.getMoviesService.getMovies("popular"));
        }
      });
    }
  }










  ngAfterContentInit(): void {
    let scrollY: number = Number(localStorage.getItem('scrollY')) || 0;
    //Provavelmente o Angular tem seu própria forma de manipular scroll, já que parece que a pagina é inteira fixa
    window.scrollTo(0, scrollY);
  }

  ngOnDestroy(): void {
    //this.getMoviesService.getPopularMovies(1).u;
    localStorage.setItem('scrollY', String(window.scrollY));
  }

  public pluralizeMovies(): boolean {
    if (this.getMoviesService.getMoviesByName().length == 1) {
      return false;
    }

    return true;
  }

  //Um dia se precisar
  public haveMoviesToGet(): boolean {
    //Se bater no final do array dos filmes da API
    return true;
  }

  public getMoviesByName(): Array<Movie> {
    return this.getMoviesService.getMoviesByName();
  }

  public increaseMovieRange(): void {
    this.getMoviesService.increaseMovieRange();
  }

  public getRange(): number {
    return this.getMoviesService.getRange();
  }

  public getSearch(): string {
    return this.getMoviesService.getSearch();
  }

  public createZeroBeforeNumbers(number: number,): string {
    return this.getGeneralService.createZeroBeforeNumbers(number);
  }
}