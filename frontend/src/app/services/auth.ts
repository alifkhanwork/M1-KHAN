import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface LoginData { id_token: string; id: number; userName: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'https://localhost:7118/api/login'; // YOUR port
  constructor(private http: HttpClient) {}

  login(userName: string, password: string) {
    return this.http.post<LoginData>(`${this.base}/login`, { userName, password });
  }
  register(form: any) {
    return this.http.post(`${this.base}/register`, form, { responseType: 'text' });
  }
}