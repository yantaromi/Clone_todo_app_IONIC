import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Ajout de FormsModule pour utiliser ngModel
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent {
  newTask: string = ''; // ✅ Déclaration de `newTask` pour éviter l'erreur

  constructor(private todoService: TodoService, private calendarService: CalendarService) {}

  /** 📌 Ajouter une tâche */
  addTask(): void {
    if (this.newTask.trim()) {
      this.todoService.addTask(this.newTask.trim());
      this.newTask = ''; // ✅ Réinitialisation après ajout
    }
  }

  /** 📌 Synchroniser les tâches du calendrier */
  syncCalendar(): void {
    this.calendarService.getTodayEvents().subscribe((response: any) => {
      const events = response.items || [];
      events.forEach((event: any) => {
        if (!this.todoService.getTasks().find(task => task.title === event.summary)) {
          this.todoService.addTask(event.summary);
        }
      });
    });
  }
}
