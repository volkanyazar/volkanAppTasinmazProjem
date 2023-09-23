import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  
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
}
