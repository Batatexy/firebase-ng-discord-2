import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../models/movie';
import { RouterLink } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ConfigurationsService } from '../../services/configurations.service';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  constructor(private getMoviesService: MoviesService, private getUserService: UserService, private getConfigurationsService: ConfigurationsService) { }

  public getImagesUrl(): string {
    return this.getMoviesService.getImagesUrl();
  }

  public getApiUrl(): string {
    return this.getMoviesService.getApiUrl();
  }

  public setFavoriteMovie(movie: Movie): void {
    this.getUserService.setFavoriteMovie(movie.id);
  }

  public getLikedState(): boolean {
    let liked: boolean = false;

    this.getUserService.getUser()?.favorites.forEach(movieID => {
      if (movieID == this.movie.id) {
        liked = true;
      }
    });

    return liked;
  }

  public getSelectedLanguage(): string {
    return this.getConfigurationsService.getSelectedLanguage();
  }
}
