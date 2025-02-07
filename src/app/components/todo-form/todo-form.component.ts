import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service'; // ✅ Service pour gérer les tâches

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Suppression de `IonicModule`
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent {
  newTask: string = '';

  constructor(private todoService: TodoService) {}

  /**
   * 📌 Ajoute une nouvelle tâche si le champ n'est pas vide
   */
  addTask(): void {
    if (this.newTask.trim()) {
      this.todoService.addTask(this.newTask.trim());
      this.newTask = ''; // ✅ Réinitialiser le champ après ajout
    }
  }
}
