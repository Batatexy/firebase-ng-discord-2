import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ConfigurationsService } from './configurations.service';
import { Credits } from '../models/credits';
import { MoviesList } from '../models/moviesList';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient, private getConfigurationsService: ConfigurationsService) { }

  // if(environment.production) {
  //   // Código específico para produção
  // } else {
  // // Código específico para desenvolvimento
  // } 

  //Filmes
  private movies: Array<MoviesList> =
    [
      {
        name: "popular",
        page: 1,
        list: []
      },
      {
        name: "top_rated",
        page: 1,
        list: []
      },
      {
        name: "now_playing",
        page: 1,
        list: []
      },
    ];

  private movie?: Movie;

  //SearchBar
  private search: string = "";

  //Variavel ajustda pelo usuario
  private rangeIncrease: number = 8;
  private range: number = this.rangeIncrease;

  //API De Filmes
  private apiUrl = 'https://api.themoviedb.org/3/movie';
  private imagesUrl = "https://image.tmdb.org/t/p/w500/";
  private defaultHeaders = {
    Authorization: 'Bearer ' + environment.apiKey,
  };

  public getMoviesByName(): Array<Movie> {
    if (this.search != "") {
      let searchMovies: Array<Movie> = [];

      this.getMovies("popular").slice(0, this.range).forEach((movie) => {
        if (movie.title.toLowerCase().includes(this.search.toLowerCase())) {
          searchMovies.push(movie);
        }
      });

      return searchMovies;
    }
    return this.getMovies("popular").slice(0, this.range);
  }

  public getMovieById(id: number, language: string): Observable<Movie> {
    let params = new HttpParams(); // query params
    params = params.set('language', language);

    return this.http.get<Movie>(`${this.apiUrl}/${id}`, {
      params: params,
      headers: this.defaultHeaders,
    });
  }

  public getCredits(id: number, language: string): Observable<Credits> {
    let params = new HttpParams(); // query params
    params = params.set('language', language);

    return this.http.get<Credits>(`${this.apiUrl}/${id}/credits`, {
      params: params,
      headers: this.defaultHeaders,
    });
  }

  //Aumentar o range de filmes exibidos na tela // Clickar no botão Ver Mais
  public increaseMovieRange(): void {

    this.addRange();

    if (this.range >= this.getMovies("popular").length) {
      this.setPage(this.getPage("popular") + 1, "popular");

      this.getMovies$(this.getPage("popular"), this.getConfigurationsService.getSelectedLanguage(), "popular").subscribe({
        next: (res) => {
          this.addMovies(res.results, "popular");
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  public getMovies$(page: number, language: string, list: string): Observable<{ results: Array<Movie>; }> {
    let params = new HttpParams(); // query params
    params = params.set('language', language);
    params = params.set('page', page);

    let url = `${this.apiUrl}/${list}`;
    console.log("url:", url);


    return this.http.get<{ results: []; }>(url, {
      params: params,
      headers: this.defaultHeaders,
    });
  }

  public getMovies(name: string): Array<Movie> {
    return this.movies.filter(movieList => movieList.name == name)[0].list;
  }

  public setMovies(movies: Array<Movie>, name: string): void {
    this.movies.forEach(movieList => {
      if (movieList.name == name) {
        movieList.list = movies;
      }
    });
  }

  public addMovies(newMovies: Array<Movie>, name: string): void {
    this.movies.forEach(movieList => {
      if (movieList.name == name) {
        movieList.list = movieList.list.concat(newMovies);
      }
    });
  }

  public getPage(name: string): number {
    return this.movies.filter(movieList => movieList.name == name)[0].page;
  }

  public setPage(page: number, name: string): void {
    this.movies.forEach(movieList => {
      if (movieList.name == name) {
        movieList.page = page;
      }
    });
  }








  //Pegar o que foi digitado pelo usuário
  public getSearch(): string {
    return this.search;
  }

  //Definir o que foi digitado pelo usuário
  public setSearch(search: string): void {
    this.search = search;
  };

  //Pegar o range de filmes exibidos
  public getRange(): number {
    return this.range;
  }

  //Definir o range de filmes exibidos
  public addRange(): void {
    this.range += this.rangeIncrease;
  }

  //Pegar o range que se é adicionado a cada clique no ver mais
  public getRangeIncrease(): number {
    return this.rangeIncrease;
  }

  //Definir o range que se é adicionado a cada clique no ver mais
  public setRangeIncrease(rangeIncrease: number): void {
    this.rangeIncrease = rangeIncrease;
  }



  public getApiUrl(): string {
    return this.apiUrl;
  }

  public getImagesUrl(): string {
    return this.imagesUrl;
  }



  public getMovie(): Movie | undefined {
    return this.movie;
  }

  public setMovie(movie: Movie | undefined): void {
    this.movie = movie;
  };
}
