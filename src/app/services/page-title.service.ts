// page-title.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private pageTitleSubject = new BehaviorSubject<string>(''); // Başlangıçta boş bir başlık

  pageTitle$ = this.pageTitleSubject.asObservable();

  setPageTitle(title: string) {
    this.pageTitleSubject.next(title);
  }
}
