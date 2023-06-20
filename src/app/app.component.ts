import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Empleado } from './Interfaces/empleado';
import { EmpleadoService } from './ServicesEmpleado/empleado.service';
import { DialogAddEditComponent } from './Dialogs/dialog-add-edit/dialog-add-edit.component';
import {MatSnackBar}from '@angular/material/snack-bar';
import { DialogoDeleteComponent } from './Dialogs/dialogo-delete/dialogo-delete.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['nombrePersona', 'cargo', 'fechacontrato','trabajaActual','Acciones'];
  dataSource = new MatTableDataSource<Empleado>();
  constructor(
    private _empleadoServicio: EmpleadoService
    ,public dialog: MatDialog,
    private _snackBar :MatSnackBar
    ){

  }
  ngOnInit(): void {
    this.mostrarEmpleados();
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  mostrarEmpleados(){
    this._empleadoServicio.getList().subscribe({
      next:(dataResponse)=>{
        console.log(dataResponse)
        this.dataSource.data = dataResponse;
      },error:(e)=>{}
    })
  }
  dialogoNuevoEmpleado() {
    this.dialog.open(DialogAddEditComponent,{
      disableClose:true,
      width:"350px"
    }).afterClosed().subscribe(resultado =>{
      if (resultado ==="creado"){
        this.mostrarEmpleados();
      }
    });
  }
  dialogoEditarEmpleado(dataEmpleado:Empleado) {
    this.dialog.open(DialogAddEditComponent,{
      disableClose:true,
      width:"350px",
      data:dataEmpleado
    }).afterClosed().subscribe(resultado =>{
      if (resultado ==="editado"){
        this.mostrarEmpleados();
      }
    });
  }
  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    });
  }

  dialogoEliminarEmpleado(dataEmpleado:Empleado){
    this.dialog.open(DialogoDeleteComponent,{
      disableClose:true,
      data:dataEmpleado
    }).afterClosed().subscribe(resultado =>{
      if (resultado ==="eliminar"){

        this._empleadoServicio.delete(dataEmpleado.empleadoId).subscribe({
          next:(data)=>{
            this.mostrarAlerta("Empleado fue eliminado","listo")
            this.mostrarEmpleados();
          },error:(e)=>{}
        })
      }
    });
  }

}
