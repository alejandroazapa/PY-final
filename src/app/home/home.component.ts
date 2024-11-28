import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToNavigate() {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);
    this.router.navigate(['/navegar']); // Redirige a la ruta 'navegar'
  }

  logout() {
    this.router.navigate(['/login']); // Redirige a la ruta 'login'
  }

}
