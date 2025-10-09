import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../taskService/task-service';
import { AuthService } from '../../authService/auth-service';
import { ActivityService } from '../../activityService/activity-service';

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
  selector: 'app-task-board',
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User {
  constructor(
    private router: Router,
    private taskService: TaskService,
    private authService: AuthService,
    private activityService: ActivityService,
    private cdr: ChangeDetectorRef
  ) {}

  todo: Task[] = [];
  progress: Task[] = [];
  completed: Task[] = [];
  deleted: Task[] = [];
  allTasks: Task[] = [];

  isDragOver: string | null = null;
  private draggedTask?: Task;

  showForm = false;

  searchQuery: string = '';

  private applyFilter(searchQuery: string = '') {
    const query = searchQuery;
    // reset lists
    this.todo = [];
    this.progress = [];
    this.completed = [];
    this.deleted = [];

    this.allTasks.forEach((task) => {
      const matches =
        !query ||
        task.details.toLowerCase().includes(query.toLowerCase()) ||
        task.project.toLowerCase().includes(query.toLowerCase()) ||
        task.priority.toLowerCase().includes(query.toLowerCase()) ||
        task.status.toLowerCase().includes(query.toLowerCase()) ||
        task.dueDate.toString().toLowerCase().includes(query);

      if (matches) {
        if (task.status === 'todo') this.todo.push(task);
        if (task.status === 'progress') this.progress.push(task);
        if (task.status === 'completed') this.completed.push(task);
        if (task.status === 'delete') this.deleted.push(task);
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.applyFilter(this.searchQuery.trim());
    }
  }

  closeForm() {
    this.showForm = false;
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTaskByUserId(this.authService.getId()).subscribe({
      next: (tasks) => {
        this.allTasks = tasks;

        // apply sorting
        const priorityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };
        this.allTasks.sort((a, b) => {
          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();
          if (dateA !== dateB) return dateA - dateB;
          return (
            (priorityOrder[a.priority.toLowerCase()] ?? 99) -
            (priorityOrder[b.priority.toLowerCase()] ?? 99)
          );
        });

        // distribute into lists
        this.applyFilter();
      },
      error: (err) => console.error('Error fetching tasks:', err),
    });
  }

  // form inputs
  newTaskDetails: string = '';
  newProjectDetails: string = '';
  newPriority: string = '';
  newDueDate: string = '';

  addTask() {
    if (!this.newTaskDetails.trim()) return;

    if (this.newDueDate) {
      const selectedDate = new Date(this.newDueDate);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        alert('Due date cannot be in the past. Please select today or a future date.');
        return;
      }
    }

    const newTask: Task = {
      id: 'task-' + Date.now(),
      details: this.newTaskDetails,
      project: this.newProjectDetails || 'General',
      priority: this.newPriority || 'Normal',
      dueDate: this.newDueDate ? new Date(this.newDueDate) : new Date(),
      status: 'todo',
      userId: this.authService.getId() || '',
    };

    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        // Add to local list only after backend confirms
        this.todo.push(createdTask);

        // clear inputs
        this.newTaskDetails = '';
        this.newProjectDetails = '';
        this.newPriority = '';
        this.newDueDate = '';

        // after Adding update list
        this.loadTasks();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating task:', err);
      },
    });

    // this.todo.push(newTask);
  }

  allowDrop(event: DragEvent, target: string) {
    event.preventDefault();
    this.isDragOver = target;
  }

  onDragLeave(event: DragEvent) {
    this.isDragOver = null;
  }

  dragStart(event: DragEvent, task: Task) {
    if (task.status === 'delete') {
      event.preventDefault();
      return;
    }
    this.draggedTask = task;
    event.dataTransfer?.setData('text/plain', task.id);
  }

  onDrop(event: DragEvent, target: 'todo' | 'progress' | 'completed' | 'delete') {
    event.preventDefault();
    this.isDragOver = null;

    if (!this.draggedTask) return;

    this.removeFromLists(this.draggedTask);

    this.draggedTask.status = target;
    if (target === 'todo') this.todo.push(this.draggedTask);
    if (target === 'progress') this.progress.push(this.draggedTask);
    if (target === 'completed') this.completed.push(this.draggedTask);
    if (target === 'delete') this.deleted.push(this.draggedTask);

    const taskId = this.draggedTask.id;
    const taskDetails = this.draggedTask.details;

    // Change to backend
    this.taskService.editTask(this.draggedTask.id, this.draggedTask).subscribe({
      next: (updated) => {
        console.log('Task updated in DB:', updated, taskId, taskDetails);
        //reload tasks to stay in sync
        this.loadTasks();
        // Log activity
        this.activityService
          .logActivity({
            userId: this.authService.getId() || sessionStorage.getItem('id')!,
            action: 'MOVE_TASK',
            entityId: taskId,
            details: `Task "${taskDetails}" moved to ${target}`,
          })
          .subscribe({
            next: (log) => console.log('Activity logged:', log),
            error: (err) => console.error('Error logging activity:', err),
          });
      },
      error: (err) => {
        console.error('Error updating task:', err);
      },
    });

    setTimeout(() => {
      const el = document.getElementById(this.draggedTask!.id);
      if (el) {
        el.classList.add('dropped');
        setTimeout(() => el.classList.remove('dropped'), 5000);
      }
    });

    this.draggedTask = undefined;
  }

  private removeFromLists(task: Task) {
    this.todo = this.todo.filter((t) => t.id !== task.id);
    this.progress = this.progress.filter((t) => t.id !== task.id);
    this.completed = this.completed.filter((t) => t.id !== task.id);
    this.deleted = this.deleted.filter((t) => t.id !== task.id);
  }

  editTaskById(id: string) {
    console.log('Editing task:', id);
    this.router.navigate(['/edit', id]);
  }

  viewTaskById(id: string) {
    console.log('Inside view:', id);
    this.router.navigate(['/view', id]);
  }

  showAllTasksPopup = false;

  openAllTasksPopup() {
    this.showAllTasksPopup = true;
  }

  closeAllTasksPopup() {
    this.showAllTasksPopup = false;
  }
}
