import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { Persona } from '../models/persona';
import { PersonaService } from '../services/persona.service';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, DropdownModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  personas: Persona[] = [];
  titulo: string = '';
  opc: string = '';
  persona = new Persona();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private personaService: PersonaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarPersonas();
  }

  listarPersonas() {
    this.cargando = true;
    this.personaService.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de personas',
        });
      },
    });
  }

  filtrarPersonas() {
    if (this.filtroNombre) {
      return this.personas.filter(persona => 
        persona.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.personas;
  }

  showDialogCreate() {
    this.titulo = 'Crear Persona';
    this.opc = 'Agregar';
    this.op = 0;
    this.persona = new Persona();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Persona';
    this.opc = 'Editar';
    this.personaService.getPersonaById(id).subscribe((data) => {
      this.persona = data;
      this.op = 1;
      this.visible = true;
    });
  }

  deletePersona(id: number) {
    this.isDeleteInProgress = true;
    this.personaService.deletePersona(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Persona eliminada',
        });
        this.isDeleteInProgress = false;
        this.listarPersonas();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la persona',
        });
      },
    });
  }

  addPersona(): void {
    if (!this.persona.nombre || this.persona.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.personaService.createPersona(this.persona).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Persona registrada',
        });
        this.listarPersonas();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar la persona',
        });
      },
    });
  }

  editPersona() {
    if (!this.persona.nombre || this.persona.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.personaService.updatePersona(this.persona, this.persona.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Persona actualizada',
        });
        this.listarPersonas();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la persona',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addPersona();
    } else if (this.op == 1) {
      this.editPersona();
    }
  }
}
