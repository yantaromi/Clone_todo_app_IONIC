import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule], // ✅ Suppression de `IonicModule`
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * 📌 Récupérer les tâches et mettre à jour la liste
   */
  loadTasks(): void {
    this.tasks = this.todoService.getTasks();
  }

  /**
   * 📌 Supprimer une tâche et mettre à jour l'affichage
   */
  removeTask(id: number): void {
    this.todoService.deleteTask(id);
    this.loadTasks(); // ✅ Mise à jour automatique après suppression
  }

  /**
   * 📌 Changer l’état de complétion d’une tâche et mettre à jour la liste
   */
  toggleCompletion(id: number): void {
    this.todoService.toggleTaskCompletion(id);
    this.loadTasks(); // ✅ Mise à jour automatique après modification
  }
}
