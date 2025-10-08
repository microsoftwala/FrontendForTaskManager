import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../userService/user-service';
import { AuthService } from '../../authService/auth-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../taskService/task-service';
import { RouterModule } from '@angular/router';

export interface User {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin {
  users: any[] = [];
  noOfUsers: number = 0;
  currentPage: number = 1;
  pageSize: number = 3;
  totalNoOfTasks: number = 0;
  paginatedUsers: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.countTask();
  }
  
  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.noOfUsers = data.length;
        this.goToPage(1);
      },
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  updatePaginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  countTask() {
    this.taskService.getAllTask().subscribe({
      next: (data) => {
        this.totalNoOfTasks = data.length;
      },
      error: (err) => {
        console.error('Error fetching in tasks', err);
      },
    });
  }

  selectedUser: any;
  currUserId: string = '';

  editUser(id: string) {
    this.currUserId = id;
    this.selectedUser = this.users.find((user) => user.id === id);
    console.log('this.selected', this.currUserId);
  }

  updateUser() {
    console.log('this.select', this.selectedUser);
    this.userService.updateUser(this.selectedUser).subscribe({
      next: (data) => {
        console.log('User updated:', data);
        this.selectedUser = null;
        this.loadUsers();
      },
      error: (err) => console.error('Error updating user:', err),
    });
  }

  deleteUser(id: string) {
    console.log('Delete User', id, ' : ', this.authService.getId());
    if (id != this.authService.getId()) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.userService.deleteUser(id).subscribe({
          next: (data) => {
            console.log('Deleted suceessfully', data);
            this.loadUsers();
          },
          error: (err) => console.error('Error deleting user:', err),
        });
      }
    } else {
      this.snackBar.open('Cannot Allow to remove Youself', 'Close', { duration: 3000 });
    }
  }
}
