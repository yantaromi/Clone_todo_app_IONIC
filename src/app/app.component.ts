import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  currentDate: string = ''; // ✅ Date du jour

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks(); // ✅ Charger les tâches au démarrage
    this.updateDate(); // ✅ Mettre à jour la date chaque jour
  }

  /**
   * 📌 Met à jour la date du jour
   */
  updateDate(): void {
    const today = new Date();
    this.currentDate = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  /**
   * 📌 Récupérer les tâches depuis le service et vérifier si toutes sont complétées
   */
  loadTasks(): void {
    this.tasks = this.todoService.getTasks();

    // ✅ Attendre un instant avant de vérifier si toutes les tâches sont complétées
    setTimeout(() => {
      const allCompleted = this.tasks.length > 0 && this.tasks.every(task => task.completed);
      if (allCompleted) {
        // this.launchConfetti(); // 🎊 Désactivé temporairement
      }
      this.cdr.detectChanges(); // ✅ Force la mise à jour d'Angular
    }, 100);
  }

  /**
   * 📌 Ajouter une nouvelle tâche et mettre à jour l'affichage
   */
  addTask(newTaskTitle: string): void {
    if (newTaskTitle.trim()) {
      this.todoService.addTask(newTaskTitle.trim());
      this.loadTasks(); // ✅ Mise à jour après ajout
    }
  }

  /**
   * 📌 Supprimer une tâche et mettre à jour l'affichage
   */
  removeTask(id: number): void {
    this.todoService.deleteTask(id);
    this.loadTasks(); // ✅ Mise à jour après suppression
  }
}
