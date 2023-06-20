import { Inject, Injectable } from '@angular/core';

import{HttpClient}from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../Interfaces/persona';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {

private endpoint:string = `${this.apiEndpoint}`;
private apiUrl:string = this.endpoint + "persona/";

  constructor(private http:HttpClient,@Inject('ApiEndpoint') private apiEndpoint: string) {
  }

  getList():Observable<Persona[]>{
  return this.http.get<Persona[]>(this.apiUrl+'lista');
  }

}
