import { Injectable } from '@angular/core';
import { Task, SubTask } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private tasks: Task[] = this.loadTasks(); // ✅ Chargement initial des tâches depuis localStorage
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks); // ✅ Observable pour mise à jour en temps réel
  tasks$ = this.tasksSubject.asObservable(); // ✅ Observable accessible depuis les composants
  private taskIdCounter: number = this.getMaxTaskId() + 1; // ✅ ID unique basé sur les tâches existantes

  constructor() {}

  /** 📌 Récupérer toutes les tâches enregistrées */
  getTasks(): Task[] {
    return [...this.tasks]; // ✅ Copie pour éviter toute mutation accidentelle
  }

  /** 📌 Ajouter une nouvelle tâche */
  addTask(title: string): void {
    if (!title.trim()) return;
    const newTask: Task = { id: this.generateUniqueId(), title, completed: false };
    this.tasks.push(newTask);
    this.updateTasks(); // ✅ Mise à jour et sauvegarde immédiate
  }

  /** 📌 Ajouter plusieurs tâches depuis Google Calendar */
  addTasksFromCalendar(events: string[]): void {
    let newTasksAdded = false;

    events.forEach(eventTitle => {
      if (!this.tasks.some(task => task.title === eventTitle)) {
        this.tasks.push({ id: this.generateUniqueId(), title: eventTitle, completed: false });
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

  /** 📌 Générer un ID unique */
  private generateUniqueId(): number {
    return this.taskIdCounter++; // ✅ Incrémentation pour éviter les ID en double
  }

  /** 📌 Obtenir le plus grand ID existant */
  private getMaxTaskId(): number {
    return this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) : 0;
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

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask; // ✅ Met à jour la tâche dans le tableau
      this.updateTasks(); // ✅ Met à jour l'observable
    }
  }
  
  addSubTask(taskId: number, subTaskTitle: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      if (!task.subTasks) {
        task.subTasks = []; // ✅ Initialise `subTasks` si elle est `undefined`
      }
      const newSubTask: SubTask = {
        id: Date.now(),
        title: subTaskTitle.trim(),
        completed: false,
        showActions: false // ✅ Ajout de showActions pour éviter undefined
      };
      task.subTasks.push(newSubTask);
      this.updateTasks();
    }
  }
  /** ✅ Bascule l'état de complétion d'une sous-tâche */
toggleSubTaskCompletion(taskId: number, subTaskId: number): void {
  const task = this.tasks.find(t => t.id === taskId);
  if (task?.subTasks) {
    const subTask = task.subTasks.find(st => st.id === subTaskId);
    if (subTask) {
      subTask.completed = !subTask.completed; // ✅ Inverse l’état de la sous-tâche
      this.updateTaskCompletion(taskId); // ✅ Vérifie si la tâche principale doit être validée
    }
  }
}

  
  deleteSubTask(taskId: number, subTaskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && task.subTasks) {
      task.subTasks = task.subTasks.filter(subTask => subTask.id !== subTaskId); // ✅ Supprime la sous-tâche
      this.updateTasks(); // ✅ Met à jour les abonnés
    }
  }
  /** ✅ Vérifie si toutes les sous-tâches sont complètes et met à jour la tâche principale */
private updateTaskCompletion(taskId: number): void {
  const task = this.tasks.find(t => t.id === taskId);
  if (task && task.subTasks) {
    // Vérifie si toutes les sous-tâches sont complétées
    const allCompleted = task.subTasks.every(subTask => subTask.completed);
    task.completed = allCompleted; // ✅ Met à jour la tâche principale
    this.updateTasks();
  }
}

  
}
