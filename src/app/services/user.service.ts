import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private selectedUsers: User[] = [];

  constructor(private httpClient: HttpClient,private authService:AuthService) { }
  path = "https://localhost:44314/api/";

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.path + "users/getall");
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.path}users/getbyid?id=`+id);
  }
  
  //addUser <-- register ile ekliyoruz şimdilik aktif değil
  addUser(user:User): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', "Authorization": `Bearer ${this.authService.token}`
      })
    };

    return this.httpClient.post<User>(`${this.path}auth/register`, user, httpOptions)
      .pipe(
        tap(data => console.log('Kullanıcı başarıyla eklendi:', data)),
        catchError(this.handleError)
      );
  }

  updateUser(user:User): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', "Authorization": `Bearer ${this.authService.token}`
      })
    };
    return this.httpClient.put<User>(`${this.path}users/update`, user, httpOptions)
      .pipe(
        tap(data => console.log('Kullanıcı güncellendi:', data)),
        catchError(this.handleError)
      );
  }


  deleteUser(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', "Authorization": `Bearer ${this.authService.token}`
      })
    };
    return this.httpClient.delete(this.path + "users/delete/" + id,httpOptions)
    .pipe(
      tap(data => console.log('Kullanıcı Silindi:', data)),
      catchError(this.handleError)
    );
  }

  getSelectedUsers(): User[] {
    return this.selectedUsers;
  }

  setSelectedUsers(users: User[]): void {
    this.selectedUsers = users;
  }

  handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = 'Bir hata oluştu ' + err.error.message
    } else {
      errorMessage = 'Sistemsel bir hata'
    }
    return throwError(errorMessage);
  }
}
