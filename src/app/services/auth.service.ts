import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/api/auth`; // Usa la URL del environment

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  /**
   * Método para registrar un nuevo usuario.
   */
  register(nombre: string, contrasenia: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { nombre, contrasenia }).pipe(
      catchError((error) => {
        const errorMessage = error.error?.message || 'Error al registrarse';
        this.toastr.error(errorMessage, 'Error');
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Método para iniciar sesión.
   */
  login(nombre: string, contrasenia: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { nombre, contrasenia }).pipe(
      tap((response: any) => {
        if (response?.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);  // Guarda el token
          localStorage.setItem('nombre', response.nombre);  // Guarda el username
          localStorage.setItem('role', response.role);  // Guarda el role
          this.toastr.success('Has accedido al sistema correctamente', 'Éxito');
        }
      }),
      catchError((error) => {
        const errorMessage = error.error?.message || 'Usuario o contraseña incorrectos';
        this.toastr.error(errorMessage, 'Error');
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Obtiene el mensaje de bienvenida basado en el rol del usuario.
   */
  getWelcomeMessage(): string {
    const role = localStorage.getItem('role')?.toLowerCase();
    switch (role) {
      case 'admin':
        return 'Hola Admin';
      case 'secretaria':
        return 'Hola Secretaria';
      default:
        return 'Hola Usuario';
    }
  }

  /**
   * Obtiene el nombre de usuario almacenado.
   */
  getUsername(): string {
    return localStorage.getItem('nombre') || '';
  }

  /**
   * Obtiene el rol del usuario almacenado.
   */
  getUserRole(): string {
    return localStorage.getItem('role')?.toLowerCase() || '';
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    localStorage.clear(); // Limpia todo el almacenamiento local
    this.toastr.info('Sesión cerrada correctamente', 'Logout');
  }

  /**
   * Verifica si el usuario está autenticado.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}