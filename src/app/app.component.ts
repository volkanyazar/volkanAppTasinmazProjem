import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  scrollEvent$: Observable<Event>;
  scrollSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.scrollEvent$ = new Observable((observer) => {
      this.scrollSubscription = fromEvent(window, 'scroll').subscribe((event) => {
        observer.next(event);
      });
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    // Scroll olayı gerçekleştiğinde yapılması gereken işlemleri buraya ekleyebilirsiniz.
  }
  
  name: string | null = null;

  ngOnInit() {
    // Kullanıcı girişi yapıldığında veya token içeriği elde edildiğinde kullanıcı adını güncelleyin
    this.authService.userName$.subscribe(userName => {
      if (userName) {
        this.name = "Hoş Geldiniz, " + userName;
      }
    });
  }

  isLoggedin() {
    return this.authService.loggedIn();
  }

  logOut() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    // Component yok edildiğinde scroll dinleyici aboneliğini iptal edin
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
