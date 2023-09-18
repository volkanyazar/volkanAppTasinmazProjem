import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class HashingHelperService {
  constructor() {}

  // Şifreleme işlemi
  sha256Encrypt(text: string, salt: string): string {
    const hash = CryptoJS.SHA256(text + salt);
    return hash.toString(CryptoJS.enc.Hex);
  }

  // Tuz oluşturma işlemi
  generateSalt(): string {
    const salt = CryptoJS.lib.WordArray.random(16); // 16 byte tuz
    return salt.toString(CryptoJS.enc.Hex);
  }
}
