import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { CalendarService } from '../../services/calendar.service'; // ✅ Ajout du service Google Calendar
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  tasks: Task[] = []; // ✅ Liste des tâches
  progress: number = 0; // ✅ Pourcentage d'avancement des tâches
  motivationMessage: string = ''; // ✅ Message dynamique
  private nextId: number = Date.now(); // ✅ Génère des ID uniques pour chaque tâche

  constructor(private todoService: TodoService, private calendarService: CalendarService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadPublicCalendarEvents(); // ✅ Charger les événements Google Calendar
  }

  /**
   * 📌 Retourne le nombre de tâches complétées
   */
  getCompletedTasksCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  /**
   * 📌 Charger les tâches depuis le service et mettre à jour la progression
   */
  loadTasks(): void {
    this.tasks = this.todoService.getTasks();
    this.updateProgress();
  }

  /**
   * 📌 Charger les événements publics depuis Google Calendar
   */
  loadPublicCalendarEvents(): void {
    this.calendarService.getPublicEvents().subscribe((response: any) => {
      const events = response.items || [];
      events.forEach((event: any) => {
        if (!this.tasks.find(task => task.title === event.summary)) {
          this.tasks.push({ id: this.nextId++, title: event.summary, completed: false });
        }
      });
    });
  }

  /**
   * 📌 Ajouter une tâche manuellement
   */
  addTask(title: string): void {
    if (title.trim()) {
      this.tasks.push({ id: this.nextId++, title, completed: false });
      this.updateProgress();
    }
  }

  /**
   * 📌 Supprimer une tâche et mettre à jour la liste des tâches
   */
  removeTask(id: number, event: MouseEvent): void {
    event.stopPropagation(); // ✅ Empêche l'événement de se propager
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.updateProgress();
  }

  /**
   * 📌 Changer l’état d’une tâche et mettre à jour la progression
   */
  toggleCompletion(id: number, event: MouseEvent): void {
    event.stopPropagation(); // ✅ Empêche l'événement de se propager
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.updateProgress();
    }
  }

  /**
   * 📌 Mettre à jour la progression et afficher un message motivant
   */
  updateProgress(): void {
    const completedTasks = this.getCompletedTasksCount();
    const totalTasks = this.tasks.length;
    this.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    this.updateMotivationMessage();
  }

  /**
   * 📌 Déterminer le message de motivation selon la progression
   */
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
