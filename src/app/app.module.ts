import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';

const routes: Routes = [
  { path: '', component: TodoListComponent }, // ✅ Route par défaut
  { path: 'add', component: TodoFormComponent }
];

// ✅ Nouvelle méthode pour démarrer une application standalone
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)) // ✅ Ajout du RouterModule
  ]
}).catch(err => console.error(err));
