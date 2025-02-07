import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app/app.component'; // ✅ Vérifie que cet import est correct
import { TodoListComponent } from './app/components/todo-list/todo-list.component'; // ✅ Vérifie cet import
import { TodoFormComponent } from './app/components/todo-form/todo-form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // ✅ Vérifie cet import

// ✅ Définition des routes pour la navigation
const routes: Routes = [
  { path: '', component: TodoListComponent }, // ✅ Page d'accueil avec la liste des tâches
  { path: 'add', component: TodoFormComponent } // ✅ Page pour ajouter une tâche
];

// ✅ Bootstrap de l'application avec `bootstrapApplication`
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)), provideAnimationsAsync() // ✅ Fournir le RouterModule avec les routes définies
  ]
}).catch(err => console.error(err));
