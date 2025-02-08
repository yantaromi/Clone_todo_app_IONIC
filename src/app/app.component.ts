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

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks(); // ✅ Charger les tâches au démarrage
  }

  /**
   * 📌 Récupérer les tâches depuis le service et vérifier si toutes sont complétées
   */
  loadTasks(): void {
    this.tasks = this.todoService.getTasks();

   /**  // ✅ Attendre un instant avant de vérifier si toutes les tâches sont complétées
    setTimeout(() => {
      const allCompleted = this.tasks.length > 0 && this.tasks.every(task => task.completed);
      if (allCompleted) {
        this.launchConfetti();
      }
      this.cdr.detectChanges(); // ✅ Force la mise à jour d'Angular
    }, 100);*/
  }

  /**
   * 📌 Supprimer une tâche et mettre à jour l'affichage
   */
  removeTask(id: number): void {
    this.todoService.deleteTask(id);
    this.loadTasks(); // ✅ Mise à jour après suppression
  }

  /**
   * 📌 Déclencher les confettis 🎊 sur toute l'application
   
  launchConfetti(): void {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    for (let i = 0; i < 100; i++) { // ✅ Augmente le nombre de confettis pour un effet plus dense
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.position = 'fixed';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = `${Math.random() * 100}vh`;
      const colors = ['red', 'yellow', 'blue', 'green', 'orange', 'pink', 'purple', 'lime', 'cyan'];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 12 + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confettiContainer.appendChild(confetti);
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }*/
}
