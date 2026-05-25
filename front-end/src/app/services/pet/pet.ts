import { Injectable, signal } from '@angular/core';
import { Pet } from '../../models/pet.model';

@Injectable({
  providedIn: 'root'
})

export class PetService {

  private _pets = signal<Pet[]> ([
    {
      nome: 'Luna',
      imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADCt6SrJdl7imry_hzCpbsbHEE7SrbMhiYOcUcIQGmdrF7uL5SWByPsgL_q0s8MMfPnPq6D_juS9YiA9-cD798YLxY7GpCuAJD6a3sJPuF0MUCjstf1KbM1QpCcgB33TF1UX4AWjSyj5bDAMB1KLGha11uLrl1ts4SpYcdRHEmVvDOUXHXdNILoaMS9cNw0ogP5EZzYQ2T1teDzoVt8fkRTWW7xvC-ObRmMH6mnCiyqcXj_Yz5ijNVMGWdLQ3VNn8z0ZyfXvErn6U',
      raca: 'Golden Retriever',
      idade: 3,
      status: 'Rotina',
      proximo: 'Check-up anual',
      id: 1
    },

    {
      nome: 'Thor',
      imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDToBLvbEes7Br-QRva2qUt1O14o-9gkcgGGZ4AMIqsIEWZsxB0CHtdnrGfuQaFqFh1biCIJXROcvwzEYOlBm8Ueq7SA3uNyw20r-P5m3WNzRDEdoEcgK69RIi56z1B4jGiF8zipEh4ZSmPEXeNuEhPzxhklqcRXftaLgj2NEOUfsc7XOIOzZjHFJfYzMh-sdLFfKO52A1vm4yEMfnm1jCR_K6_CB5i5pfcffRdk-qkVNGG919qimysLNMPYertV7Q9Qt0a2j700jw',
      raca: 'Persa',
      idade: 5,
      status: 'Saudável',
      proximo: 'Tratamento contra pulgas',
      id: 2
    }
  ]);

  get pets() {
    return this._pets.asReadonly();
  }
}