// Örnek bir JWT ayarları servisi
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtConfigService {
  private readonly jwtConfig = {
    issuer: 'cccyyyccc.com/',
    audience: 'vvvyyyccc.com/',
    securitykey:'bestsuperideakeystoremythebestkeystore'
  };

  getJwtConfig() {
    return this.jwtConfig;
  }
}
