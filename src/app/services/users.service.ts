import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  private dbUrl = 'http://localhost:3000'
  private user?: User;


  constructor(private http: HttpClient) { }


  encryptText(text: string): string {
    return btoa(text);
  }

  //Usuário, Publico
  public postUser(user: User): Observable<unknown> {
    return this.http.post<unknown>(`${this.dbUrl}/users`, { ...user });
  }

  public putUser(user: User): Observable<unknown> {
    return this.http.put<unknown>(`${this.dbUrl}/users/${user.userID}`, { ...user });
  }

  public getUserByID$(userID: number): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.dbUrl}/users?userID=${userID}`);
  }

  public getUserByEmailAndPassword$(email: string, password: string): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.dbUrl}/users?email=${email}&password=${password}`);
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
  }

}
