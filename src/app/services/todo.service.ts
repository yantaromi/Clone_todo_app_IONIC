import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private tasks: Task[] = this.loadTasks(); // ✅ Chargement initial des tâches depuis localStorage
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks); // ✅ Observable pour la mise à jour en temps réel des tâches
  tasks$ = this.tasksSubject.asObservable(); // ✅ Observable accessible depuis d'autres composants

  constructor() {
    // 🔄 Sauvegarde automatique lorsqu'un changement est détecté sur les tâches
    this.tasksSubject.subscribe(() => {
      this.saveTasks();
    });
  }

  /**
   * 📌 Récupérer toutes les tâches enregistrées
   * @returns Liste des tâches
   */
  getTasks(): Task[] {
    return [...this.tasks]; // ✅ Retourne une copie pour éviter toute mutation accidentelle
  }

  /**
   * 📌 Ajouter une nouvelle tâche à la liste
   * @param title - Le titre de la tâche
   */
  addTask(title: string): void {
    if (!title.trim()) return;
    const newTask: Task = { id: Date.now(), title, completed: false };
    this.tasks.push(newTask);
    this.tasksSubject.next([...this.tasks]); // ✅ Mise à jour de l'observable
    this.saveTasks(); // ✅ Sauvegarde immédiate après ajout
    console.log('Tâche ajoutée :', newTask);
  }

  /**
   * 📌 Supprimer une tâche par son ID
   * @param id - L'identifiant de la tâche à supprimer
   */
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.tasksSubject.next([...this.tasks]); // ✅ Mise à jour de l'observable
    this.saveTasks(); // ✅ Assurer la sauvegarde immédiate
    console.log('Tâche supprimée, ID:', id);
  }

  /**
   * 📌 Bascule l'état de complétion d'une tâche
   * @param id - L'identifiant de la tâche à modifier
   */
  toggleTaskCompletion(id: number): void {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.tasksSubject.next([...this.tasks]); // ✅ Mise à jour de l'observable
      this.saveTasks(); // ✅ Assurer la sauvegarde immédiate
      console.log('État de la tâche changé, ID:', id, 'Complétée:', task.completed);
    }
  }

  /**
   * 📌 Supprimer toutes les tâches complétées (appelée à minuit)
   */
  removeCompletedTasks(): void {
    console.log("🗑 Suppression des tâches complétées...");
    
    // ✅ Supprime les tâches complétées en mémoire
    this.tasks = this.tasks.filter(task => !task.completed);
  
    // ✅ Écrase immédiatement `localStorage` avec la liste mise à jour
    this.saveTasks();
  
    // ✅ Met à jour l'interface utilisateur
    this.tasksSubject.next([...this.tasks]);
  
    console.log("✅ Tâches restantes après suppression :", this.tasks);
  }
  
  /**
   * 📌 Sauvegarder les tâches dans `localStorage`
   */
  public saveTasks(): void {
    console.log("💾 Sauvegarde forcée des tâches :", this.tasks);
    
    // ✅ Vérifier si les tâches ont changé avant de sauvegarder
    const currentTasks = JSON.stringify(this.tasks);
    const storedTasks = localStorage.getItem('tasks');
    
    if (storedTasks !== currentTasks) {
      localStorage.setItem('tasks', currentTasks); // ✅ Écrit uniquement les nouvelles tâches
      this.tasksSubject.next([...this.tasks]); // ✅ Mise à jour immédiate après sauvegarde
    }
  }
  
  /**
   * 📌 Charger les tâches depuis `localStorage`
   * @returns Liste des tâches enregistrées ou un tableau vide si aucune tâche n'est trouvée
   */
  private loadTasks(): Task[] {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  }
}
