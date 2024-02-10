import { Injectable } from '@angular/core';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private firebaseConfig = {
    apiKey: "AIzaSyDC1HXs76FAqEpB953pMN6tq6XIfeFD5n8",
    authDomain: "laorlabeda.firebaseapp.com",
    databaseURL: "https://laorlabeda-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "laorlabeda",
    storageBucket: "laorlabeda.appspot.com",
    messagingSenderId: "690065838030",
    appId: "1:690065838030:web:b95d765ac634a92477659f"
  };

  private app = this.initializeFirebase();

  constructor() { }

  private initializeFirebase() {
    // Verifica si ya existen instancias de la aplicación de Firebase para evitar errores de inicialización múltiple
    if (!getApps().length) {
      return initializeApp(this.firebaseConfig);
    } else {
      return getApp(); // Si ya está inicializada, retorna la instancia existente
    }
  }

  getAuth() {
    return getAuth(this.app);
  }


}
