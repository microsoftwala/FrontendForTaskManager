import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../taskService/task-service';


interface Task {
  id: string;
  details: string;
  project: string;
  priority: string;
  dueDate: Date;
  status: 'todo' | 'progress' | 'completed' | 'delete';
}


@Component({
  selector: 'app-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class View {
  taskId!: string;
  task?: Task;

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id')!;
    console.log('Got task id:', this.taskId);

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (data) => (this.task = data),
      error: (err) => console.error('Error fetching task', err),
    });
  }
}
