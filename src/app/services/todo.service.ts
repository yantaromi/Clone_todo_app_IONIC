import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private tasks: Task[] = this.loadTasks(); // ✅ Chargement des tâches depuis localStorage
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  tasks$ = this.tasksSubject.asObservable(); // ✅ Observable pour mettre à jour en temps réel

  constructor() {
    this.tasksSubject.subscribe(tasks => {
      this.saveTasks(); // ✅ Sauvegarde automatique lorsqu'il y a un changement
    });
  }

  /**
   * 📌 Récupérer toutes les tâches enregistrées
   */
  getTasks(): Task[] {
    return this.tasks;
  }

  /**
   * 📌 Ajouter une nouvelle tâche à la liste
   */
  addTask(title: string): void {
    const newTask: Task = { id: Date.now(), title, completed: false };
    this.tasks.push(newTask);
    this.tasksSubject.next([...this.tasks]); // ✅ Mise à jour de la liste
    console.log('Tâche ajoutée :', newTask);
  }

  /**
   * 📌 Supprimer une tâche par son ID
   */
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.tasksSubject.next([...this.tasks]); // ✅ Mise à jour de la liste
    console.log('Tâche supprimée, ID:', id);
  }

  /**
   * 📌 Changer l’état de complétion d’une tâche
   */
  toggleTaskCompletion(id: number): void {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.tasksSubject.next([...this.tasks]); // ✅ Mise à jour de la liste
      console.log('État de la tâche changé, ID:', id, 'Complétée:', task.completed);
    }
  }

  /**
   * 📌 Sauvegarder les tâches dans `localStorage`
   */
  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  /**
   * 📌 Charger les tâches depuis `localStorage`
   */
  private loadTasks(): Task[] {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  }
}
