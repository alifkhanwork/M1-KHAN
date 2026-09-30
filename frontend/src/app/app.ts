import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './services/token-storage';

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class AppComponent {
  constructor(public tokenStorage: TokenStorageService, private router: Router) {}

  get authScreen(): boolean {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
  }

  logout() { this.tokenStorage.signOut(); this.router.navigate(['/login']); }
}
