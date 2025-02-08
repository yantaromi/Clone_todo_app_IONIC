import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { CalendarService } from './services/calendar.service'; // ✅ Import du service Google Calendar
import { TodoService } from './services/todo.service'; // ✅ Import du service To-Do

const routes: Routes = [
  { path: '', component: TodoListComponent }, // ✅ Route par défaut
  { path: 'add', component: TodoFormComponent }
];

// ✅ Nouvelle méthode pour démarrer une application standalone avec services
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)), // ✅ Ajout du RouterModule
    importProvidersFrom(HttpClientModule), // ✅ Ajout de HttpClientModule pour API Google
    TodoService, // ✅ Ajout du service To-Do
    CalendarService // ✅ Ajout du service Google Calendar
  ]
}).catch(err => console.error(err));
