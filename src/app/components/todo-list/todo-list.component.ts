import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { CalendarService } from '../../services/calendar.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  progress: number = 0;
  motivationMessage: string = '';
  private nextId: number = Date.now();
  private cleanupTimer: any;
  private tasksSubscription!: Subscription;

  constructor(private todoService: TodoService, private calendarService: CalendarService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.tasksSubscription = this.todoService.tasks$.subscribe(updatedTasks => {
      this.tasks = updatedTasks;
      this.updateProgress();
    });
    this.loadTodayCalendarEvents();
    this.scheduleDailyCleanup();
  }

  ngOnDestroy(): void {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
    }
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe(); // ✅ Nettoyage de l'abonnement pour éviter les fuites de mémoire
    }
  }

  getCompletedTasksCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }

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

  scheduleDailyCleanup(): void {
    const now = new Date();
    const testTime = new Date();
    testTime.setMinutes(testTime.getMinutes() + 2); // 🔄 Réinitialisation dans 2 minutes pour test
    
    const timeUntilReset = testTime.getTime() - now.getTime();
    console.log(`🕛 Suppression prévue dans ${timeUntilReset / 1000 / 60} minutes`);

    this.cleanupTimer = setTimeout(() => {
      this.removeCompletedTasks();
      this.loadTodayCalendarEvents();
      this.scheduleDailyCleanup();
    }, timeUntilReset);
  }

  removeCompletedTasks(): void {
    this.todoService.removeCompletedTasks();
    this.updateProgress(); // ✅ Mise à jour de la progression après suppression
    console.log('✅ Tâches complétées supprimées et sauvegardées.');
  }

  addTask(title: string): void {
    if (title.trim()) {
      this.todoService.addTask(title.trim());
    }
  }

  removeTask(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.todoService.deleteTask(id);
  }

  toggleCompletion(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.todoService.toggleTaskCompletion(id);
  }

  updateProgress(): void {
    const completedTasks = this.getCompletedTasksCount();
    const totalTasks = this.tasks.length;
    this.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    this.updateMotivationMessage();
  }

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
