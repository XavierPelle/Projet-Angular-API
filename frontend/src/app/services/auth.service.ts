import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'PostWorldAuthToken';

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${environment.API_URL}/users/login`, body);
  }

  register(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${environment.API_URL}/users/create`, body);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {

      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(atob(tokenParts[1]));

      return payload.role || null;
    } catch (err) {
      console.error('Erreur lors du décodage du token', err);
      return null;
    }
  }
}

