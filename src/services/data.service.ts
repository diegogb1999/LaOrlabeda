import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private firebaseUrl = 'https://laorlabeda-default-rtdb.europe-west1.firebasedatabase.app/';
  private nodo = "usuarios";
  //private apiUrl = 'https://tu-api.com/datos';

  constructor(private http: HttpClient) {

  }

  agregarDatos(datos: any): Observable<any> {
    return this.http.post(`${this.firebaseUrl}/${this.nodo}.json`, datos);
  }

  obtenerDatos(): Observable<any> {
    return this.http.get(`${this.firebaseUrl}/${this.nodo}.json`);
  }

  actualizarDatos(id: string, datosActualizados: any): Observable<any> {
    const url = `${this.firebaseUrl}${this.nodo}/${id}.json`;
    return this.http.put<any>(url, datosActualizados);
  }

  eliminarRegistro(id: string): Observable<void> {
    const url = `${this.firebaseUrl}${this.nodo}${id}.json`;
    return this.http.delete<void>(url);
    }
    
}
