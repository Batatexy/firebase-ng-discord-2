import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private getRouter: Router) { }

  //Login
  tryLogin(email: string, password: string) {

    localStorage.setItem('token', 'true');
    this.getRouter.navigate(['/dashboard']);



  }

  //Register
  register(email: string, password: string) {

  }

  //Logout
  logout() {

  }













}