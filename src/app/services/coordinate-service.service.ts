import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordinateService {
  private coordinateSubject = new BehaviorSubject<number[]>([]);
  public coordinate$ = this.coordinateSubject.asObservable();

  setCoordinates(coordinates: number[]) {
    this.coordinateSubject.next(coordinates);
  }

  getCoordinates(): Observable<number[]> {
    return this.coordinate$;
  }
}
