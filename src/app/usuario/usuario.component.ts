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
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, DropdownModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  usuarios: Usuario[] = [];
  titulo: string = '';
  opc: string = '';
  usuario = new Usuario();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios() {
    this.cargando = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de usuarios',
        });
      },
    });
  }

  filtrarUsuarios() {
    if (this.filtroNombre) {
      return this.usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.usuarios;
  }

  showDialogCreate() {
    this.titulo = 'Crear Usuario';
    this.opc = 'Agregar';
    this.op = 0;
    this.usuario = new Usuario();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Usuario';
    this.opc = 'Editar';
    this.usuarioService.getUsuarioById(id).subscribe((data) => {
      this.usuario = data;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteUsuario(id: number) {
    this.isDeleteInProgress = true;
    this.usuarioService.deleteUsuario(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Usuario eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarUsuarios();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el usuario',
        });
      },
    });
  }

  addUsuario(): void {
    if (!this.usuario.nombre || this.usuario.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.usuarioService.createUsuario(this.usuario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Usuario registrado',
        });
        this.listarUsuarios();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el usuario',
        });
      },
    });
  }

  editUsuario() {
    if (!this.usuario.nombre || this.usuario.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.usuarioService.updateUsuario(this.usuario, this.usuario.idusuario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Usuario actualizado',
        });
        this.listarUsuarios();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el usuario',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addUsuario();
    } else if (this.op == 1) {
      this.editUsuario();
    }
  }
}
