import { Component } from '@angular/core';
import { WhiteCardComponent } from '../../components/white-card/white-card.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { MoviesService } from '../../services/movies.service';
import { ConfigurationsService } from '../../services/configurations.service';
import { Movie } from '../../models/movie';
import { CommonRouterButtonComponent } from '../../components/common-router-button/common-router-button.component';
import { User } from '../../models/user';
import { CarrouselMoviesComponent } from '../../components/carrousel-movies/carrousel-movies.component';

@Component({
  selector: 'app-home',
  imports: [
    WhiteCardComponent,
    MovieCardComponent, TranslatePipe,
    CommonRouterButtonComponent, CarrouselMoviesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  movieSlice: number = 4;

  constructor(private getUserService: UserService, private getMoviesService: MoviesService, private getConfigurationsService: ConfigurationsService) { }

  ngOnInit() {
    this.getConfigurationsService.selectedLanguage$.subscribe({
      next: (language) => {
        this.getUserService.generateFavoriteMoviesList();
        this.setMovies();
      }
    });


    this.setMovies();

    this.getUserService.generateFavoriteMoviesList();
    console.log("User:", this.getUserService.getUser());
    console.log("Favorites Movies:", this.getUserService.getFavoritesMovies());
  }

  public setMovies() {
    this.getMoviesService.setMovies([], "top_rated");
    this.getMoviesService.setMovies([], "now_playing");

    for (let page = 1; page <= this.getMoviesService.getPage("top_rated"); page++) {
      this.getMoviesService.getMovies$(page, this.getConfigurationsService.getSelectedLanguage(), "top_rated").subscribe({
        next: (res) => {
          this.getMoviesService.addMovies(res.results, "top_rated");
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.log("Filmes:", this.getMoviesService.getMovies("top_rated"));
        }
      });
    }

    for (let page = 1; page <= this.getMoviesService.getPage("now_playing"); page++) {
      this.getMoviesService.getMovies$(page, this.getConfigurationsService.getSelectedLanguage(), "now_playing").subscribe({
        next: (res) => {
          this.getMoviesService.addMovies(res.results, "now_playing");
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.log("Filmes:", this.getMoviesService.getMovies("now_playing"));
        }
      });
    }
  }

  public getMovies(movieList: string): Array<Movie> {
    return this.getMoviesService.getMovies(movieList);
  }

  public getFavoritesMovies(): Array<Movie> {
    return this.getUserService.getFavoritesMovies();
  }

  public getUser(): User | undefined {
    return this.getUserService.getUser();
  }
}
