import { Component, OnInit, Inject} from '@angular/core';
import {FormBuilder,FormGroup,Validators}from "@angular/forms";
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

import{MatSnackBar} from '@angular/material/snack-bar';
import{MAT_DATE_FORMATS} from '@angular/material/core';
import* as moment from 'moment';

import { Persona } from 'src/app/Interfaces/persona';
import { Empleado } from 'src/app/Interfaces/empleado';
import { PersonaService } from 'src/app/ServicesPersona/persona.service';
import { EmpleadoService } from 'src/app/ServicesEmpleado/empleado.service';

export const MY_DATE_FORMATS={
  parse:{
    dateInput:'DD/MM/YYYY',
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY',
    dateA11yLabel:'LL',
    monthYearA11yLabel:'MMMM YYYY'

  }
}

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css'],
  providers:[
    {provide: MAT_DATE_FORMATS,useValue: MY_DATE_FORMATS}
  ]
})
export class DialogAddEditComponent implements OnInit{

  formEmpleado:FormGroup;
  tituloAccion: string = "Nuevo ";
  botonAccion:string= "Guardar";
  ListaPersonas:Persona[]=[];

  constructor(
private dialogoReferencia:MatDialogRef<DialogAddEditComponent>,
private fb:FormBuilder,
private _snackBar:MatSnackBar,
private _PersonaServicio: PersonaService,
private _EmpleadoServicio:EmpleadoService,
@Inject(MAT_DIALOG_DATA) public dataEmpleado:Empleado
  ){

    this.formEmpleado = this.fb.group({
      cargo:['',Validators.required],
      personaId:['',Validators.required],
      fechacontrato:  ['',Validators.required],
      trabajaActual:['',Validators.required],
    })
    this._PersonaServicio.getList().subscribe({
      next:(data)=>{
        this.ListaPersonas = data;
      },error:(e)=>{}
    })

  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    });
  }

  addEditEmpleado(){
    const modelo: Empleado= {
      empleadoId:0,
      cargo:this.formEmpleado.value.cargo,
      personaId:this.formEmpleado.value.personaId,
      fechacontrato: moment(this.formEmpleado.value.fechacontrato).format("DD/MM/YYYY"),
      trabajaActual:this.formEmpleado.value.trabajaActual // V2
    }

    if(this.dataEmpleado == null){
      this._EmpleadoServicio.add(modelo).subscribe({
        next:(data)=>{
          this.mostrarAlerta("Empleado fue creado","listo");
          this.dialogoReferencia.close("creado");
        },error:(e)=>{
          this.mostrarAlerta("No se pudo crear","error!");
         }
      })
    }else{
      this._EmpleadoServicio.update(this.dataEmpleado.empleadoId,modelo).subscribe({
        next:(data)=>{
          this.mostrarAlerta("Empleado fue editado","listo");
          this.dialogoReferencia.close("editado");
        },error:(e)=>{
          this.mostrarAlerta("No se pudo editar","error!");
         }
      })
    }


  }

  ngOnInit(): void {
    if(this.dataEmpleado){
      this.formEmpleado.patchValue({
        cargo:this.dataEmpleado.cargo,
        personaId:this.dataEmpleado.personaId,
        fechacontrato: moment(this.formEmpleado.value.fechacontrato, 'DD/MM/YYYY')
      })
    }
    this.tituloAccion= "Editar ";
    this.botonAccion = "Actualizar";
  }


}
