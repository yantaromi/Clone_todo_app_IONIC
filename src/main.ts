import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // ✅ Remplace HttpClientModule par provideHttpClient()

import { AppComponent } from './app/app.component'; // ✅ Vérifie que cet import est correct
import { TodoListComponent } from './app/components/todo-list/todo-list.component';
import { TodoFormComponent } from './app/components/todo-form/todo-form.component';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ Remplace provideAnimationsAsync()

import { TodoService } from './app/services/todo.service';
import { CalendarService } from './app/services/calendar.service';

// ✅ Définition des routes pour la navigation
const routes: Routes = [
  { path: '', component: TodoListComponent }, // ✅ Page d'accueil avec la liste des tâches
  { path: 'add', component: TodoFormComponent } // ✅ Page pour ajouter une tâche
];

// ✅ Bootstrap de l'application avec `bootstrapApplication`
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)),
    provideHttpClient(), // ✅ Nouvelle méthode recommandée pour HttpClient
    provideAnimations(), // ✅ Corrigé : `provideAnimationsAsync()` n'existe pas
    TodoService,
    CalendarService
  ]
}).catch(err => console.error(err));
