import { Inject, Injectable } from '@angular/core';
import{HttpClient}from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../Interfaces/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

private endpoint:string = `${this.apiEndpoint}`;
private apiUrl:string = this.endpoint + "empleado/";

  constructor(private http:HttpClient,@Inject('ApiEndpoint') private apiEndpoint: string) { }

  getList():Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.apiUrl+'lista');
    }

  add(modelo:Empleado):Observable<Empleado>{
    return this.http.post<Empleado>(this.apiUrl +'guardar',modelo);
  }
  update(empleadoId:number,modelo:Empleado):Observable<Empleado>{
    return this.http.put<Empleado>(this.apiUrl +'actualizar/'+empleadoId,modelo);
  }
  delete(empleadoId:number):Observable<void>{
    return this.http.delete<void>(this.apiUrl +'eliminar/'+empleadoId);
  }

}
