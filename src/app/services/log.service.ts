import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Log } from '../models/log';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private selectedLogs: Log[] = [];
  
  constructor(private httpClient: HttpClient, private authService:AuthService) { }
  path = "https://localhost:44314/api/";

  getAll(): Observable<Log[]> {
    return this.httpClient.get<Log[]>(this.path + "logs/getall");
  }

  getSelectedLogs(): Log[] {
    return this.selectedLogs;
  }

  setSelectedLogs(logs: Log[]): void {
    this.selectedLogs = logs;
  }

  // Log eklemek için yeni bir işlev ekleyin
  addLog(log: Log): Observable<Log> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.token}`
      })
    };

    return this.httpClient.post<Log>(this.path + "logs/add", log, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = 'Bir hata oluştu ' + err.error.message;
    } else {
      errorMessage = 'Sistemsel bir hata';
    }
    return throwError(errorMessage);
  }
}
