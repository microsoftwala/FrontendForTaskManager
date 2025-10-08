import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../authService/auth-service';
import { TaskService } from '../taskService/task-service';
import { UserService } from '../userService/user-service';

interface Task {
  id: string;
  details: string;
  project: string;
  priority: string;
  dueDate: Date;
  status: 'todo' | 'progress' | 'completed' | 'delete';
  userId: string;
}

@Component({
  selector: 'app-user-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails {
  userId: string = '';

  todo: Task[] = [];
  progress: Task[] = [];
  completed: Task[] = [];
  deleted: Task[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.detailsOfUserAndTask(this.userId);
  }

  detailsOfUserAndTask(id: string) {
    console.log('Id:', id);
    this.taskService.getAllTaskByUserId(id).subscribe({
      next: (tasks) => {
        // Reset lists
        this.todo = [];
        this.progress = [];
        this.completed = [];
        this.deleted = [];

        // Distribute tasks into their lists
        tasks.forEach((task) => {
          if (task.status === 'todo') this.todo.push(task);
          if (task.status === 'progress') this.progress.push(task);
          if (task.status === 'completed') this.completed.push(task);
          if (task.status === 'delete') this.deleted.push(task);
        });
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }
}
