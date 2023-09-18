import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.loggedIn() && this.authService.isAdmin()) {
      // Kullanıcı giriş yapmış ve "Admin" rolüne sahipse, sayfayı görüntülemesine izin ver
      return true;
    } else {
      // Kullanıcı giriş yapmamışsa veya "Admin" rolüne sahip değilse, hata sayfasına yönlendir
      this.router.navigate(['/err']); // Hata sayfasının yolunu uygun şekilde güncelleyin
      return false;
    }
  }
}
