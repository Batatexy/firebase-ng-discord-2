
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';
import { Movie } from '../models/movie';
import { MoviesService } from './movies.service';
import { ConfigurationsService } from './configurations.service';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private apiUrl = 'http://localhost:3000';

  private user?: User;
  private favoritesMovies: Array<Movie> = [];

  constructor(private http: HttpClient, private getMoviesService: MoviesService, private getConfigurationsService: ConfigurationsService) {
    this.getUser$(1).subscribe({
      next: (user) => {
        this.user = user[0];
      }
    });
  }

  public setFavoriteMovie(movieID: number) {
    if (this.user) {
      let push: boolean = true;

      for (let i = 0; i < this.user.favorites.length; i++) {
        if (this.user.favorites[i] == movieID) {
          this.user.favorites.splice(i, 1);
          this.favoritesMovies.splice(i, 1);
          push = false;
        }
      }

      if (push) {
        this.user.favorites.push(movieID);
      }

      this.putUser(this.user).subscribe({});
    }
  }

  public generateFavoriteMoviesList() {
    this.getUser$(1).subscribe({
      next: (user) => { this.user = user[0]; },

      complete: () => {
        this.favoritesMovies = [];

        this.user?.favorites.forEach(movie => {
          this.getMoviesService.getMovieById(movie, this.getConfigurationsService.getSelectedLanguage()).subscribe({
            next: (movie) => {
              this.favoritesMovies.push(movie);
            }
          });
        });
      }
    });
  }



  public removeFavoriteMovie(userID: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/users?id=${userID}`);
  }


  public postUser(user: User): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/users`, { ...user });
  }

  public putUser(user: User): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/users/${user.id}`, { ...user });
  }

  public getUser$(id: number): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.apiUrl}/users?id=${id}`);
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
  }



  public setFavoritesMovies(favoritesMovies: Array<Movie>): void {
    this.favoritesMovies = favoritesMovies;
  }

  public getFavoritesMovies(): Array<Movie> {
    return this.favoritesMovies;
  }

}


