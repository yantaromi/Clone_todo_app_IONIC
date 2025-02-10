import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private tasks: Task[] = this.loadTasks(); // ✅ Chargement initial des tâches depuis localStorage
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks); // ✅ Observable pour la mise à jour en temps réel
  tasks$ = this.tasksSubject.asObservable(); // ✅ Observable accessible depuis d'autres composants

  constructor() {}

  /** 📌 Récupérer toutes les tâches enregistrées */
  getTasks(): Task[] {
    return [...this.tasks]; // ✅ Retourne une copie pour éviter toute mutation accidentelle
  }

  /** 📌 Ajouter une nouvelle tâche */
  addTask(title: string): void {
    if (!title.trim()) return;
    const newTask: Task = { id: Date.now(), title, completed: false };
    this.tasks.push(newTask);
    this.updateTasks(); // ✅ Mise à jour et sauvegarde immédiate
  }

  /** 📌 Ajouter plusieurs tâches depuis Google Calendar */
  addTasksFromCalendar(events: string[]): void {
    let newTasksAdded = false;

    events.forEach(eventTitle => {
      if (!this.tasks.some(task => task.title === eventTitle)) {
        this.tasks.push({ id: Date.now(), title: eventTitle, completed: false });
        newTasksAdded = true;
      }
    });

    if (newTasksAdded) {
      this.updateTasks(); // ✅ Mise à jour uniquement si de nouvelles tâches sont ajoutées
    }
  }

  /** 📌 Supprimer une tâche */
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.updateTasks(); // ✅ Mise à jour et sauvegarde immédiate
  }

  /** 📌 Basculer l'état de complétion */
  toggleTaskCompletion(id: number): void {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.updateTasks(); // ✅ Mise à jour et sauvegarde immédiate
    }
  }

  /** 📌 Supprimer toutes les tâches complétées */
  removeCompletedTasks(): void {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.updateTasks(); // ✅ Mise à jour et sauvegarde immédiate
  }

  /** 📌 Mise à jour et sauvegarde des tâches */
  private updateTasks(): void {
    this.saveTasks(); // ✅ Sauvegarde immédiate dans `localStorage`
    this.tasksSubject.next([...this.tasks]); // ✅ Mise à jour de l'interface utilisateur
  }

  /** 📌 Sauvegarde des tâches dans `localStorage` */
  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  /** 📌 Charger les tâches depuis `localStorage` */
  private loadTasks(): Task[] {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  }
}
