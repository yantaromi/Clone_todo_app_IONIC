import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoService } from './services/todo.service'; // ✅ Import du service
import { Task } from './models/task.model'; // ✅ Import du modèle de tâche
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoListComponent, TodoFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Ma To-Do List';
  tasks: Task[] = []; // ✅ Liste des tâches
  currentDate: string = ''; // ✅ Date du jour
  private tasksSubscription!: Subscription; // ✅ Stocker l'abonnement pour le nettoyer

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateDate(); // ✅ Mettre à jour la date chaque jour
    this.loadTasks(); // ✅ Charger les tâches sans supprimer celles complétées au démarrage

    // ✅ Abonnement aux tâches pour mise à jour automatique
    this.tasksSubscription = this.todoService.tasks$.subscribe(updatedTasks => {
      this.tasks = updatedTasks;
      this.cdr.detectChanges(); // ✅ Force la mise à jour d'Angular
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe(); // ✅ Nettoyer l'abonnement pour éviter les fuites de mémoire
    }
  }

  /** 📌 Met à jour la date du jour */
  updateDate(): void {
    const today = new Date();
    this.currentDate = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  /** 📌 Charger les tâches sans supprimer celles accomplies */
  loadTasks(): void {
    this.tasks = this.todoService.getTasks();
  }

  /** 📌 Ajouter une nouvelle tâche */
  addTask(newTaskTitle: string): void {
    if (newTaskTitle.trim()) {
      this.todoService.addTask(newTaskTitle.trim());
      this.loadTasks(); // ✅ Recharger les tâches après ajout
    }
  }

  /** 📌 Supprimer une tâche */
  removeTask(id: number): void {
    this.todoService.deleteTask(id);
    this.loadTasks(); // ✅ Recharger les tâches après suppression
  }

  /** 📌 Bascule l'état de complétion d'une tâche */
  toggleCompletion(id: number): void {
    this.todoService.toggleTaskCompletion(id);
    this.loadTasks(); // ✅ Recharger les tâches après modification
  }
}
