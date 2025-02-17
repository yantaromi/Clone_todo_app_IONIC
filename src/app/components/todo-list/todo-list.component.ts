import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { CalendarService } from '../../services/calendar.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';
import { TaskViewComponent } from '../task-view/task-view.component'; // ✅ Import du composant standalone

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TaskViewComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  progress: number = 0;
  motivationMessage: string = '';
  private tasksSubscription!: Subscription;
  private cleanupTimer: any;
 
  selectedTask: Task | null = null;
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
   * 📌 Utilisation de trackBy pour optimiser l'affichage des tâches et éviter le décalage
   */
  trackById(index: number, task: Task): number {
    return task.id;
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
    const completedTasks = this.tasks.filter(task => task.completed).length;
    const totalTasks = this.tasks.length;
    this.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    this.updateMotivationMessage();
  }
  /** ✅ Ouvre la fenêtre modale avec les détails de la tâche */
  openTaskView(task: Task): void {
    this.selectedTask = task;
  }
  /** ✅ Ferme la fenêtre modale */
  closeTaskView(): void {
    this.selectedTask = null;
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
