import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../taskService/task-service';
import { AuthService } from '../authService/auth-service';

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
  selector: 'app-edit-task',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css',
})
export class EditTask {
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  taskId!: string;
  task!: Task;

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id')!;
    console.log('Got task id:', this.taskId);

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (data) => {
        this.task = {
          ...data,
          userId: this.authService.getId() || '',
        };
      },
      error: (err) => console.error('Error fetching task', err),
    });

    this.taskId = this.route.snapshot.paramMap.get('id')!;
    console.log('Got task id:', this.taskId);
  }

  onSubmit() {
    this.taskService.editTask(this.taskId, this.task).subscribe({
      next: (updatedTask) => {
        console.log('Task updated:', updatedTask);
        this.router.navigate(['/user']);
      },
      error: (err) => console.error('Error updating task', err),
    });
  }
}
