import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  full_name: string;
  role: string;
}

export interface UserPayload {
  username: string;
  password?: string;
  full_name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Backend API adresini tek yerde tutuyor.
  private baseUrl = 'http://localhost:3000';
  private tokenKey = 'token';
  private userKey = 'user';

  constructor(private http: HttpClient) {}

  login(data: { username: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, data).pipe(
      tap(res => {
        // Başarılı girişten sonra token ve kullanıcı bilgisini saklıyor.
        if (res?.access_token) {
          localStorage.setItem(this.tokenKey, res.access_token);
        }

        if (res?.user) {
          localStorage.setItem(this.userKey, JSON.stringify(res.user));
        }
      })
    );
  }

  getUsers() {
    // Listeleme isteğinde JWT header olarak gönderiliyor.
    return this.http.get<User[]>(`${this.baseUrl}/users`, {
      headers: this.getAuthHeaders()
    });
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createUser(data: UserPayload) {
    return this.http.post<User>(`${this.baseUrl}/users`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: number, data: UserPayload) {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(id: number) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  currentUserToken(): string | null {
    return this.getToken();
  }

  getCurrentUser(): User | null {
    const rawUser = localStorage.getItem(this.userKey);

    return rawUser ? JSON.parse(rawUser) : null;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }

  logout() {
    // Çıkışta localStorage temizleniyor.
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();

    // Token varsa Authorization header içine Bearer olarak ekliyor.
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
}
