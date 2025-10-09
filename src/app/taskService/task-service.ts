import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  id: string;
  details: string;
  project: string;
  priority: string;
  dueDate: Date;
  status: 'todo' | 'progress' | 'completed' | 'delete';
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://backendfortaskmanager-ptqp.onrender.com/tasks';
  // private apiUrl = 'http://localhost:3000/tasks'
  constructor(private httpClient: HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken') || '';
    console.log('Token', token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getTaskById(id: string): Observable<Task> {
    return this.httpClient.get<Task>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllTask(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllTaskByUserId(id: string | null): Observable<Task[]> {
    console.log(this.getAuthHeaders());
    return this.httpClient.get<Task[]>(`${this.apiUrl}/userId/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(this.apiUrl, task, {
      headers: this.getAuthHeaders(),
    });
  }

  editTask(id: string, task: Task): Observable<Task> {
    return this.httpClient.put<Task>(`${this.apiUrl}/${id}`, task, {
      headers: this.getAuthHeaders(),
    });
  }
}
