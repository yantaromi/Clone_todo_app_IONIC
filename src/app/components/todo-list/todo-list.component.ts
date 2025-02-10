import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Importation nécessaire pour [(ngModel)]
import { TodoService } from '../../services/todo.service';
import { CalendarService } from '../../services/calendar.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Ajout de FormsModule pour éviter l'erreur [(ngModel)]
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  newTaskTitle: string = ''; // ✅ Ajout de la variable pour le binding [(ngModel)]
  progress: number = 0;
  motivationMessage: string = '';
  private tasksSubscription!: Subscription;
  private cleanupTimer: any;

  constructor(private todoService: TodoService, private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.tasksSubscription = this.todoService.tasks$.subscribe(updatedTasks => {
      this.tasks = updatedTasks;
      this.updateProgress();
    });

    this.scheduleDailyCleanup();
  }

  ngOnDestroy(): void {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
    }
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  /** 📌 Charge les tâches du calendrier Google lors du clic sur "Sync Calendar" */
  loadTodayCalendarEvents(): void {
    this.calendarService.getTodayEvents().subscribe((response: any) => {
      const events = response.items || [];
      events.forEach((event: any) => {
        if (!this.tasks.find(task => task.title === event.summary)) {
          this.todoService.addTask(event.summary);
        }
      });
    });
  }

  /** 📌 Supprime les tâches complétées automatiquement à minuit */
  scheduleDailyCleanup(): void {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
      this.todoService.removeCompletedTasks();
      this.scheduleDailyCleanup();
    }, timeUntilMidnight);
  }

  /** 📌 Ajoute une nouvelle tâche */
  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.todoService.addTask(this.newTaskTitle.trim());
      this.newTaskTitle = ''; // ✅ Réinitialiser l'input après ajout
    }
  }

  /** 📌 Supprime une tâche */
  removeTask(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.todoService.deleteTask(id);
  }

  /** 📌 Marque une tâche comme terminée */
  toggleCompletion(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.todoService.toggleTaskCompletion(id);
  }

  /** 📌 Mise à jour de la progression */
  updateProgress(): void {
    const completedTasks = this.tasks.filter(task => task.completed).length;
    const totalTasks = this.tasks.length;
    this.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    this.updateMotivationMessage();
  }

  /** 📌 Affichage du message de motivation */
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

  /** 📌 Optimisation de l'affichage des tâches */
  trackById(index: number, task: Task): number {
    return task.id;
  }
}
