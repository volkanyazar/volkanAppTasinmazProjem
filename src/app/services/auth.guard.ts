import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    const isUserLoggedIn = this.authService.loggedIn();
    
    if (isUserLoggedIn) {
      const isAccessTokenExpired = this.authService.isTokenExpired();
      if (!isAccessTokenExpired) {
        return true;
      }else{
      this.router.navigateByUrl("auth/login"); 
      return false;
      }
    } else {
      this.router.navigateByUrl("auth/login"); 
      return false;
    }
  }
}
