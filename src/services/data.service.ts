import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private firebaseUrl = 'https://laorlabeda-default-rtdb.europe-west1.firebasedatabase.app/';
  //private apiUrl = 'https://tu-api.com/datos';

  constructor(private http: HttpClient, private authService: AuthService, private db: AngularFireDatabase) {

  }

  agregarDatos(datos: any, nodo: string): Observable<any> {
    return this.http.post(`${this.firebaseUrl}/${nodo}.json?auth=${this.authService.getToken}`, datos);
  }

  obtenerDatos(nodo: string): Observable<any> {
    return this.http.get(`${this.firebaseUrl}/${nodo}.json?auth=${this.authService.getToken}`);
  }

  /*
  obtenerAlumnos(): Observable<any[]> {
  return this.db.list('/alumnos').snapshotChanges().pipe(
    map(changes => 
      changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
    )
  );
}
  */

  actualizarDatos(id: string, datosActualizados: any, nodo: string): Observable<any> {
    const url = `${this.firebaseUrl}${nodo}/${id}.json?auth=${this.authService.getToken}`;
    return this.http.put<any>(url, datosActualizados);
  }

  eliminarRegistro(id: string, nodo: string): Observable<void> {
    const url = `${this.firebaseUrl}${nodo}/${id}.json?auth=${this.authService.getToken}`;
    return this.http.delete<void>(url);
  }

  existeAlumnoPorNombre(nombre: string): Observable<boolean> {
    nombre = nombre.toLowerCase(); // Convertir el nombre a minúsculas para la comparación
    return this.db.list('/alumnos', ref => ref.orderByChild('nombreParaComparar').equalTo(nombre))
      .snapshotChanges() // Usa snapshotChanges para acceder a los datos y metadatos
      .pipe(
        take(1), // Asegura que solo se accede una vez a los datos
        map(changes => changes.length > 0) // Transforma el resultado a un valor booleano
      );
  }

  existeProfesorPorNombre(nombre: string): Observable<boolean> {
    nombre = nombre.toLowerCase(); // Convertir el nombre a minúsculas para la comparación
    return this.db.list('/profesores', ref => ref.orderByChild('nombreParaComparar').equalTo(nombre))
      .snapshotChanges() // Usa snapshotChanges para acceder a los datos y metadatos
      .pipe(
        take(1), // Asegura que solo se accede una vez a los datos
        map(changes => changes.length > 0) // Transforma el resultado a un valor booleano
      );
  }

  /* 
   existeAlumnoPorNombre(nombre: string): Observable<boolean> {
    nombre = nombre.toLowerCase(); // Convertir el nombre a minúsculas para la comparación
    return this.db.list('/alumnos', ref => ref.orderByChild('nombreParaComparar').equalTo(nombre))
      .valueChanges()
      .pipe(
        map(alumnos => alumnos.length > 0) // Si hay alumnos, significa que el nombre ya existe
      );
  }
  */

  // Agrega esto dentro de tu clase AlumnosComponent
  getAlumnos() {
    return this.obtenerDatos('alumnos').pipe(
      map(response => {
        // Comprobar si response es null o undefined
        if (response === null || response === undefined) {
          // Devolver un arreglo vacío si no hay datos
          return [];
        }
        // Si hay datos, proceder con el mapeo
        return Object.keys(response).map(key => ({ ...response[key], id: key }));
      })
    );
  }

  getProfesores() {
    return this.obtenerDatos('profesores').pipe(
      map(response => {
        // Comprobar si response es null o undefined
        if (response === null || response === undefined) {
          // Devolver un arreglo vacío si no hay datos
          return [];
        }
        // Si hay datos, proceder con el mapeo
        return Object.keys(response).map(key => ({ ...response[key], id: key }));
      })
    );
  }
  agregarAlumnosOrla(data: any, nodo:string): Observable<any> {
    return this.http.post(`${this.firebaseUrl}/${nodo}.json?auth=${this.authService.getToken}`, data);
  }
  agregarProfesoresOrla(data: any, nodo:string): Observable<any> {
    return this.http.post(`${this.firebaseUrl}/${nodo}.json?auth=${this.authService.getToken}`, data);
  }
}
