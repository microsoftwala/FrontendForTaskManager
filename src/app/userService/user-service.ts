import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Users {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://backendfortaskmanager-ptqp.onrender.com/users';
  // private apiUrl = 'http://localhost:3000/users';
  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllUsers(): Observable<Users[]> {
    return this.httpClient.get<Users[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateUser(changes: Users): Observable<Users> {
    return this.httpClient.put<Users>(`${this.apiUrl}`, changes, {
      headers: this.getAuthHeaders(),
    });
  }

  updateUserPassword(id: number, newPassword: string): Observable<Users> {
    return this.httpClient.put<Users>(
      `${this.apiUrl}/updatePassword/${id}`,
      { newPassword },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
