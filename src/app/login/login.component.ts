import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  nombre: string = '';
  contrasenia: string = '';
  welcomeMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.nombre, this.contrasenia).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        console.log('Rol almacenado:', response.role);
        this.router.navigate(['/home']);
      },
      error: () => {
        // Manejo de errores
      }
    });
  }
}
