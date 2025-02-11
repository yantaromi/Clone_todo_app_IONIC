import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Ajout de FormsModule pour ngModel
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent {
  newTaskTitle: string = ''; // ✅ Déclaration de la variable

  constructor(private todoService: TodoService, private calendarService: CalendarService) {}

  /** 📌 Ajouter une tâche */
  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.todoService.addTask(this.newTaskTitle.trim());
      this.newTaskTitle = ''; // ✅ Réinitialisation après ajout
    }
  }

  /** 📌 Synchroniser les tâches du calendrier */
  syncCalendar(): void {
    this.calendarService.getTodayEvents().subscribe((response: any) => {
      const events = response.items || [];
      const eventTitles = events.map((event: any) => event.summary);
      this.todoService.addTasksFromCalendar(eventTitles);
    });
  }
}
