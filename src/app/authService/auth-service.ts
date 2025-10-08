import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://backendfortaskmanager-ptqp.onrender.com/auth';
  // private baseUrl = 'http://localhost:3000/auth';

  constructor(private httpClient: HttpClient) {}

  private usernameSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('username'));
  private email: string = '';
  private id: string = '';
  username$ = this.usernameSubject.asObservable();

  setUser(name: string) {
    sessionStorage.setItem('username', name);
    this.usernameSubject.next(name);
  }

  // Call API for login
  login(data: { email: string; password: string }): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, data);
  }

  // Call API for signup
  signup(data: { name: string; email: string; password: string }): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/signup`, data);
  }

  // Save token in sessionStorage
  setToken(token: string) {
    sessionStorage.setItem('authToken', token);
  }

  // Get token
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  //Get Username
  getUserName(): string | null {
    return sessionStorage.getItem('username');
  }

  // Remove token
  logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('Role');

    this.usernameSubject.next(null);
    this.email = '';
  }

  // Check login state
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // set Email
  setEmail(Email: string) {
    this.email = Email;
    sessionStorage.setItem('email', Email);
  }

  // set Id
  setId(id: string) {
    this.id = id;
    sessionStorage.setItem('id', id);
  }

  // getId
  getId(): string | null {
    return sessionStorage.getItem('id') || this.id;
  }

  //get email
  getEmail(): string | null {
    return this.email || sessionStorage.getItem('email');
  }

  //set Role
  setRole(role: string) {
    sessionStorage.setItem('Role', role);
  }

  //getRole
  getRole(): string | null {
    return sessionStorage.getItem('Role');
  }
}
