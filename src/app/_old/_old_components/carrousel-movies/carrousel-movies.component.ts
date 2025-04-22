import { Component, Input } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-carrousel-movies',
  imports: [MovieCardComponent, CommonModule],
  templateUrl: './carrousel-movies.component.html',
  styleUrl: './carrousel-movies.component.scss'
})
export class CarrouselMoviesComponent {

  @Input() id: string = "";
  @Input() movieSlice: number = 1;
  @Input() movies: Array<Movie> = [];


  public carrouselMovies() {
    let quantity: number = (this.movies.length - this.movieSlice) / this.movieSlice;

    if (quantity < 1) {
      quantity = 1;
    }

    if (quantity > parseInt(String(quantity))) {
      quantity = parseInt(String(quantity)) + 1;
    }

    return new Array(quantity);
  }
}
