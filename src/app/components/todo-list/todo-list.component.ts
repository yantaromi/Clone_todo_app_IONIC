import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  progress: number = 0; // ✅ Ajout de la variable progress
  motivationMessage: string = ''; // ✅ Ajout de la variable motivationMessage
  newTaskTitle: string = ''; // ✅ Ajout d'une variable pour l'entrée utilisateur
  private tasksSubscription!: Subscription;
  private cleanupTimer: any;

  constructor(private todoService: TodoService, private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.tasksSubscription = this.todoService.tasks$.subscribe(updatedTasks => {
      this.tasks = updatedTasks;
      this.updateProgress();
    });
  }

  ngOnDestroy(): void {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
    }
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  /**
   * 📌 Optimisation de l'affichage des listes avec trackBy pour éviter des re-rendus inutiles
   */
  trackById(index: number, task: Task): number {
    return task.id;
  }

  /** 📌 Ajouter une tâche */
  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.todoService.addTask(this.newTaskTitle.trim());
      this.newTaskTitle = ''; // ✅ Réinitialiser le champ après ajout
    }
  }

  /** 📌 Supprimer une tâche */
  removeTask(id: number, event: MouseEvent): void {
    event.stopPropagation(); // ✅ Empêche l'activation du toggle si on clique sur le bouton
    this.todoService.deleteTask(id);
  }

  /** 📌 Bascule l'état de complétion d'une tâche */
  toggleCompletion(id: number, event: MouseEvent): void {
    event.stopPropagation(); // ✅ Empêche un conflit avec la suppression
    this.todoService.toggleTaskCompletion(id);
  }

  /** 📌 Synchroniser les tâches avec Google Calendar */
  syncCalendarTasks(): void {
    this.calendarService.getTodayEvents().subscribe((response: any) => {
      const events = response.items || [];
      events.forEach((event: any) => {
        if (!this.tasks.find(task => task.title === event.summary)) {
          this.todoService.addTask(event.summary);
        }
      });
    });
  }

  /** 📌 Mise à jour de la progression */
  updateProgress(): void {
    const completedTasks = this.tasks.filter(task => task.completed).length;
    const totalTasks = this.tasks.length;
    this.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    this.updateMotivationMessage();
  }

  /** 📌 Mise à jour du message de motivation */
  updateMotivationMessage(): void {
    if (this.progress >= 75 && this.progress < 100) {
      this.motivationMessage = '🔥 Dernière ligne droite, on lâche pas !';
    } else if (this.progress >= 50 && this.progress < 75) {
      this.motivationMessage = '🎉 Tu es à mi-chemin, bravo !';
    } else if (this.progress >= 25 && this.progress < 50) {
      this.motivationMessage = '👏 Bon travail ! Continue comme ça !';
    } else if (this.progress === 100) {
      this.motivationMessage = '🎇 Bravo !! Tu as fini ta To-Do Liste ! 🎇';
    } else {
      this.motivationMessage = '';
    }
  }
}
