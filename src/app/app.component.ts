import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoService } from './services/todo.service'; // ✅ Import du service
import { Task } from './models/task.model'; // ✅ Import du modèle de tâche

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoListComponent, TodoFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Ma To-Do List';
  tasks: Task[] = []; // ✅ Liste des tâches

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTasks(); // ✅ Charger les tâches au démarrage
  }

  /**
   * 📌 Récupérer les tâches depuis le service
   */
  loadTasks(): void {
    this.tasks = this.todoService.getTasks();
  }

  /**
   * 📌 Supprimer une tâche et mettre à jour l'affichage
   */
  removeTask(id: number): void {
    this.todoService.deleteTask(id);
    this.loadTasks(); // ✅ Mise à jour après suppression
  }
}
