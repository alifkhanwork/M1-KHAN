import { Injectable } from '@angular/core';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const NAME_KEY = 'auth-name';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  signOut(): void { window.sessionStorage.clear(); }
  saveToken(token: string): void { window.sessionStorage.setItem(TOKEN_KEY, token); }
  getToken(): string | null { return window.sessionStorage.getItem(TOKEN_KEY); }
  saveUser(id: number, name: string): void {
    window.sessionStorage.setItem(USER_KEY, id.toString());
    window.sessionStorage.setItem(NAME_KEY, name);
  }
  getName(): string | null { return window.sessionStorage.getItem(NAME_KEY); }
  isLoggedIn(): boolean { return !!this.getToken(); }
}