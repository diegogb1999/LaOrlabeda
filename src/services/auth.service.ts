import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Auth, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { map, take } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly COOKIE_KEY = 'my_auth_token';

  constructor(protected cookieService: CookieService,private firebaseService: FirebaseService, private afAuth: AngularFireAuth) {}
  
  register(email: string, password: string): Promise<boolean> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          return result.user.getIdToken().then((token) => {
            this.cookieService.set(this.COOKIE_KEY, token); // Guardar el token en la cookie
            return true; // Retornar true para indicar un registro (y autenticación) exitoso
          });
        } else {
          throw new Error('No user found');
        }
      })
      .catch((error) => {
        console.error('Error en el registro:', error);
        return false; // Retornar false para indicar que el registro falló
      });
  }

  /*login(email: string, password: string): Promise<UserCredential> {
    const auth = this.firebaseService.getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }*/
  login(email: string, password: string): Promise<boolean> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          return result.user.getIdToken().then((token) => {
            this.cookieService.set(this.COOKIE_KEY, token); // Guardar el token en la cookie
            return true; // Retornar true para indicar un inicio de sesión exitoso
          });
        } else {
          throw new Error('No user found');
        }
      })
      .catch((error) => {
        console.error('Error en la autenticación:', error);
        return false; // Retornar false para indicar que el inicio de sesión falló
      });
  }

  logout(): Promise<void> {
    this.cookieService.delete(this.COOKIE_KEY);
    const auth = this.firebaseService.getAuth();
    return signOut(auth);
  }

  isAuthenticated(): boolean {
    const auth = this.firebaseService.getAuth();
    return auth.currentUser !== null;
  }

  isLoggedInCookie(): boolean {
    return this.cookieService.check(this.COOKIE_KEY);
  }

  getToken(): Promise<string | null> {
    const auth = this.firebaseService.getAuth();
    const currentUser = auth.currentUser;
    return currentUser ? currentUser.getIdToken() : Promise.resolve(null);
  }
  
  getAuthTokenCookie(): string | undefined {
    return this.cookieService.get(this.COOKIE_KEY);
  }
  
  //-----------------------------------------------------------------------

}
