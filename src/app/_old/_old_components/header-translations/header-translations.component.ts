import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-header-translations',
  imports: [TranslatePipe],
  templateUrl: './header-translations.component.html',
  styleUrl: './header-translations.component.scss'
})
export class HeaderTranslationsComponent {
  @Input() path?: string;

  constructor(private getMoviesService: MoviesService) { }

  public getMovie(): Movie | undefined {
    return this.getMoviesService.getMovie();
  }
}
