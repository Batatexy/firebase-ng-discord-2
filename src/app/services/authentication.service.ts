import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private getFireAuth: Auth, private getRouter: Router) { }

  //Login
  login(email: string, password: string) {

    signInWithEmailAndPassword(this.getFireAuth, email, password).then(() => {
      localStorage.setItem('token', 'true');
      this.getRouter.navigate(['/dashboard']);
    }).catch((error) => {
      console.error('Error during login:', error);
      this.getRouter.navigate(['/login']);
    });
  }

  //Register
  register(email: string, password: string) {
    createUserWithEmailAndPassword(this.getFireAuth, email, password).then(() => {
      localStorage.setItem('token', 'true');
      alert('Registrado com Sucesso!');
      this.getRouter.navigate(['/dashboard']);
    }).catch((error) => {
      console.error('Error during registration:', error);
      this.getRouter.navigate(['/register']);
    });
  }

  //Logout
  logout() {
    signOut(this.getFireAuth).then(() => {
      localStorage.removeItem('token');
      this.getRouter.navigate(['/login']);
    }, (error) => {
      console.error('Error during logout:', error);
    });
  }













}