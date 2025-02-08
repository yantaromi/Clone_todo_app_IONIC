import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private API_KEY = 'AIzaSyDqnE6LUV2UAljmrPhsDqsWaBOQkBmPACs'; // 🔑 Remplace par ta clé API Google
  private calendarId = 'yahiamallem84@gmail.com'; // 📅 ID du calendrier public

  constructor(private http: HttpClient) {}

  /**
   * 📌 Récupère les événements d'un calendrier public Google
   */
  getPublicEvents(): Observable<any> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?key=${this.API_KEY}`;
    return this.http.get(url);
  }
}
