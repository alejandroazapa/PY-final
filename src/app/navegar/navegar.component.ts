import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navegar',
  standalone: true,
  imports: [RouterModule, SidebarModule, ButtonModule],
  templateUrl: './navegar.component.html',
  styleUrl: './navegar.component.css'
})
export class NavegarComponent {
  isCollapsed = false;
  constructor(public authService: AuthService) {}

  get username(): string {
    return this.authService.getUsername();
  }

  get role(): string {
    return this.authService.getUserRole();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  @Input() sidebarVisible: boolean = true;
  @Input() ubicacionActual: string = '';
}
