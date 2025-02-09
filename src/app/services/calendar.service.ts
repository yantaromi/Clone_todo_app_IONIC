import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private API_KEY = environment.GOOGLE_API_KEY;
  private calendarId = environment.GOOGLE_CALENDAR_ID; // ✅ Assure-toi que cette variable est bien définie

  constructor(private http: HttpClient) {}

  getTodayEvents(): Observable<any> {
    if (!this.API_KEY) {
      console.error('❌ Clé API manquante ! Vérifie environment.ts.');
      return throwError(() => new Error('Clé API manquante.'));
    }
    if (!this.calendarId) {
      console.error('❌ ID du calendrier manquant ! Vérifie environment.ts.');
      return throwError(() => new Error('ID du calendrier manquant.'));
    }

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events` +
                `?key=${this.API_KEY}&timeMin=${startOfDay}&timeMax=${endOfDay}&singleEvents=true&orderBy=startTime`;

    console.log('📡 URL envoyée à Google Calendar:', url);

    return this.http.get(url).pipe(
      retry(1), // ✅ Réduit le nombre de tentatives pour éviter les ralentissements
      catchError((error) => {
        console.error('❌ Erreur Google Calendar:', error);
        console.error('🔍 Vérifie que la clé API est valide et que le calendrier est public.');
        return throwError(() => new Error('Erreur lors de la récupération des événements.'));
      })
    );
  }
}
