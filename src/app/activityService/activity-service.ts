// activity.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Activity {
  id?: string | number;
  userId: string;
  action: string; // e.g. "MOVE_TASK"
  entityId: string; // task id
  details: string; // description
  timestamp?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl = 'https://backendfortaskmanager-ptqp.onrender.com/users/activity';
  private apiUrlWithoutLogin = 'https://backendfortaskmanager-ptqp.onrender.com/activity';
  // private apiUrl = 'http://localhost:3000/users/activity';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  logActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrlWithoutLogin, activity);
  }

  logActivityWithoutLogin(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrlWithoutLogin, activity);
    // return this.http.post<Activity>(`http://localhost:3000/activity`, activity);
  }

  getRecentActivities(limit: number = 5): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}?_sort=timestamp&_order=desc&_limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // getActivities(): Observable<Activity[]> {
  //   return this.http.get<Activity[]>(this.apiUrl, {
  //     headers: this.getAuthHeaders(),
  //   });
  // }
}
