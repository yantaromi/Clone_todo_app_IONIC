import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // ✅ Import du module HTTP

import { AppComponent } from './app/app.component'; // ✅ Vérifie que cet import est correct
import { TodoListComponent } from './app/components/todo-list/todo-list.component'; // ✅ Vérifie cet import
import { TodoFormComponent } from './app/components/todo-form/todo-form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // ✅ Vérifie cet import

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
    importProvidersFrom(HttpClientModule), // ✅ Ajout de HttpClientModule pour éviter les erreurs liées à HttpClient
    provideAnimationsAsync(),
    TodoService,
    CalendarService
  ]
}).catch(err => console.error(err));
