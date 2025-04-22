import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search-area',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './search-area.component.html',
  styleUrl: './search-area.component.scss'
})
export class SearchAreaComponent {
  search: string = "";

  constructor(private getMoviesService: MoviesService) { }

  changeSearch(): void {
    this.getMoviesService.setSearch(this.search);
  }

  ngOnInit(): void {
    document.getElementById("search-movies")?.focus();
  }

}
