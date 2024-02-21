import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/services/auth.service';
import { DataService } from 'src/services/data.service';
import { FirebaseStorageService } from 'src/services/firebase-storage.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cuadro-actualizar-alumno',
  templateUrl: './cuadro-actualizar-alumno.component.html',
  styleUrls: ['./cuadro-actualizar-alumno.component.scss']
})
export class CuadroActualizarAlumnoComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  editarAlumnoForm!: FormGroup;
  fileSelected: boolean = false;
  nodo: string = "alumnos";


  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private storageService: FirebaseStorageService, private dataService: DataService, private dialogRef: MatDialogRef<CuadroActualizarAlumnoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    
      this.initForm();
    
  }

  initForm(): void {
    this.editarAlumnoForm = new FormGroup({
      nombre: new FormControl(this.data.alumno.nombre, Validators.required),
      fechaNacimiento: new FormControl(this.data.alumno.fechaNacimiento, Validators.required),
      edad: new FormControl(this.data.alumno.edad, [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]),
      grado: new FormControl(this.data.alumno.grado, Validators.required)
      // Añade aquí otros campos según necesites
    });
  }

  async editarAlumno() {

    try {

      if (this.editarAlumnoForm.valid) {

        const { nombre, fechaNacimiento, edad, grado } = this.editarAlumnoForm.value;

        const fecha = new Date(fechaNacimiento);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const ano = fecha.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${ano}`; // Formato DD-MM-YYYY

        this.dataService.existeAlumnoPorNombre(nombre).subscribe(async existe => {

          if (!existe || (existe && this.data.alumno.nombre == nombre)) {
            // Si el alumno no existe, procede con la lógica de agregar alumno
            const file = this.fileInput.nativeElement.files[0];
            const filePath = `fotosAlumno/${file.name}_${new Date().getTime()}`;

            // Sube la imagen a Firebase Storage y obtiene la URL
            const imageUrl = await this.storageService.uploadFile(filePath, file);
            const datosUsuario = { nombre, fechaNacimiento: fechaFormateada, edad, grado, imageUrl };

            // Guarda los datos del usuario en Firebase Realtime Database
            this.dataService.actualizarDatos(this.data.alumno.id, datosUsuario, this.nodo).subscribe(() => {
              this.snackBar.open('Alumno actualizado con éxito!', 'Cerrar', { duration: 3000 });
              this.editarAlumnoForm.reset();
              //window.location.reload();
              this.dialogRef.close(true);
            }, error => {
              console.error(error);
              this.snackBar.open('Ocurrió un error al intentar agregar el alumno. Por favor intentelo nuevamente más tarde.', 'Cerrar', { duration: 3000 });
            });

          } else if (existe && this.data.alumno.nombre != nombre){
            this.snackBar.open('Ese nombre de usuario ya pertenece a otro alumno.', 'Cerrar', { duration: 3000 });
          }

        }, error => {
          console.error(error);
          this.snackBar.open('Error al comprobar si el alumno existe. Por favor intentelo nuevamente más tarde.', 'Cerrar', { duration: 3000 });
        });

      }
    } catch (error) {
      this.snackBar.open('Error atrapado. Por favor intentelo nuevamente más tarde.', 'Cerrar', { duration: 3000 });
    }
  }

  cancelarAdd(): void {
    this.dialogRef.close(false);
  }

  srcResult: any;
  onFileSelected() {
    const inputNode = document.querySelector('#file') as HTMLInputElement;

    if (typeof FileReader !== 'undefined' && inputNode && inputNode.files && inputNode.files.length > 0) {
      this.fileSelected = true; // Actualiza aquí
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Asegúrate de que e.target no sea null utilizando el operador ?.
        this.srcResult = e.target?.result;
      };

      reader.readAsDataURL(inputNode.files[0]);
    } else {
      this.fileSelected = false; // Asegúrate de manejar el caso donde no hay archivo
    }
  }

}