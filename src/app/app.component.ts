import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoService } from './services/todo.service';
import { Task } from './models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoListComponent, TodoFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Ma To-Do List';
  tasks: Task[] = [];
  currentDate: string = '';
  private tasksSubscription!: Subscription;

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateDate();
    this.tasksSubscription = this.todoService.tasks$.subscribe(updatedTasks => {
      this.tasks = updatedTasks;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  updateDate(): void {
    const today = new Date();
    this.currentDate = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  addTask(newTaskTitle: string): void {
    if (newTaskTitle.trim()) {
      this.todoService.addTask(newTaskTitle.trim());
    }
  }

  removeTask(id: number): void {
    this.todoService.deleteTask(id);
  }

  toggleCompletion(id: number): void {
    this.todoService.toggleTaskCompletion(id);
  }
}
