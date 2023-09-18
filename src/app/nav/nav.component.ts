import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PageTitleService } from '../services/page-title.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Mevcut Taşınmazlar Listesi';
  private pageTitleSubscription: Subscription;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private pageTitleService: PageTitleService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.pageTitleSubscription = this.pageTitleService.pageTitle$.subscribe(title => {
      this.pageTitle = title;
      this.cdr.detectChanges();
    });

    this.authService.userName$.subscribe(userName => {
      this.isLoggedIn = !!userName; // Kullanıcı adı varsa giriş yapılmış demektir
      this.isAdmin = this.authService.isAdmin(); // Admin rolüne sahipse true döner
    });
  }

  ngOnDestroy() {
    this.pageTitleSubscription.unsubscribe(); // Aboneliği burada iptal et
  }
}
