import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
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

  constructor(private todoService: TodoService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadTasks();
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
   * 📌 Supprimer une tâche et mettre à jour la liste des tâches
   */
  removeTask(id: number): void {
    this.todoService.deleteTask(id);
    this.loadTasks();
  }

  /**
   * 📌 Changer l’état d’une tâche et mettre à jour la progression
   */
  toggleCompletion(id: number): void {
    this.todoService.toggleTaskCompletion(id);
    this.loadTasks();
  }

  /**
   * 📌 Mettre à jour la progression et afficher un message motivant
   */
  updateProgress(): void {
    const completedTasks = this.getCompletedTasksCount();
    const totalTasks = this.tasks.length;
    this.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    this.updateMotivationMessage();

  /**   // ✅ Déclenche les confettis lorsque la progression atteint 100%
    if (this.progress === 100) {
      this.launchConfetti();
      // this.launchFireworks(); // 🎆 Feu d’artifice mis en commentaire
    }*/
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

  /**
   * 📌 Déclencher les confettis 🎊
   
  launchConfetti(): void {
    const confettiContainer = document.createElement('div');
    confettiContainer.id = 'confetti-container';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = `${Math.random() * 100}vw`;
      const colors = ['red', 'yellow', 'blue', 'green', 'orange', 'pink', 'purple'];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 5;
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
