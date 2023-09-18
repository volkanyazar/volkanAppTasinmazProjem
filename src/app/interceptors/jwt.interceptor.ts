import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.token;
    const jwtConfig = this.authService.getJwtConfig();

    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          Issuer: jwtConfig.issuer,
          Audience: jwtConfig.audience,
        },
      });
    }

    return next.handle(request);
  }
}
