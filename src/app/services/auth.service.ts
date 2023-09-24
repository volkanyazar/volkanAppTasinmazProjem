import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AlertifyService } from "./alertify.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { JwtConfigService } from "./jwt-config.service";
import { UserForRegisterDto } from "../dtos/userForRegisterDto";
import { User } from "../models/user";
import { UserForLoginDto } from "../dtos/userForLoginDto";
import { TokenInfo } from "../models/token-info";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private apiUrl = "https://localhost:44314/api/auth";
  userToken: any;
  decodedToken: TokenInfo;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token";
  IsUserLogged = false;
  userTokenDatas = [];

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private alertifyService: AlertifyService,
    private jwtConfigService: JwtConfigService
  ) {}



  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  // Kullanıcı adını güncellemek için bu fonksiyonu kullanabilirsiniz
  updateUserName(userName: string | null) {
    this.userNameSubject.next(userName);
  }
  getJwtConfig() {
    return this.jwtConfigService.getJwtConfig();
  }

  getIdentity(): TokenInfo | null {
    if (this.loggedIn()) {
      const token = this.token;
      const decoded = this.jwtHelper.decodeToken(token);
      // TokenInfo arayüzüne uygun olarak kullanıcı bilgilerini al
      const identity: TokenInfo = {
        nameidentifier: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        email: decoded["email"],
        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        nbf: decoded["nbf"],
        exp: decoded["exp"],
        iss: decoded["iss"],
        aud: decoded["aud"]
      };
      return identity;
    }
    return null;
  }
  

  login(userForLoginDto: UserForLoginDto): void {
    const headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` });
  
    this.httpClient
      .post(this.apiUrl + "/login", userForLoginDto, { headers: headers })
      .subscribe(
        (data: any) => {
          const responseData = data["data"];
          this.saveToken(responseData.token); // API'den gelen token'i kaydedin
          this.userToken = responseData;
          console.log(responseData);
          console.log(this.jwtHelper.decodeToken(responseData.token));
          this.decodedToken = this.jwtHelper.decodeToken(responseData.token) as TokenInfo;
          this.alertifyService.success("Sisteme giriş yapıldı");
          this.router.navigateByUrl("/tasinmaz");
          this.IsUserLogged = true;

          //this.updateUserName(this.getIdentity().name);
        },
        (error: any) => {
          console.log(error);
          this.alertifyService.error("Kullanıcı adı veya Şifre Hatalı...");
        }
      );
  }
  
  

  register(userForRegister: UserForRegisterDto, password: string): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` });
    const body = {
      email: userForRegister.email,
      password: password,
      firstName: userForRegister.firstName,
      lastName: userForRegister.lastName,
      role: userForRegister.role,
      adres: userForRegister.adres
    };
  
    return this.httpClient.post(`${this.apiUrl}/register`, body, { headers: headers })
      .pipe(
        map((response: any) => {
          console.log('Kullanıcı başarıyla eklendi.');
          return response; // API'den dönen veriyi geri döndür
        }),
        catchError((error: any) => {
          // Kayıt başarısızsa
         console.error('Kullanıcı kaydı başarısız: ' + error);
          throw error;
        })
      );
  }
  
  
  


  isAdmin(): boolean {
    try {
      const role = this.getIdentity().role;
  
      if (role && role === 'Admin') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      // Rol bilgisini bulamadığımızda, konsola hata mesajı yazmayın ve kullanıcıyı giriş ekranına yönlendirin
      this.router.navigate(['auth/login']); // Giriş ekranının yolunu uygun şekilde güncelleyin
      return false;
    }
  }
  
  


  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  
  logOut() {
    this.alertifyService.confirm("UYARI!","Çıkış yapmak istediğinize emin misiniz?",
      () => {
        localStorage.removeItem(this.TOKEN_KEY);
        this.alertifyService.success("Sistemden çıkış yapıldı");
        this.IsUserLogged = false;
        this.router.navigateByUrl("auth/login"); 
        console.log(this.TOKEN_KEY);
      },
      () => {
        this.alertifyService.error("Çıkış işlemi iptal edildi.");
      }
    );
  }


  loggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !==  null?
      this.IsUserLogged = true:false;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem("refreshToken");
    const headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` });
  
    return this.httpClient.post<any>(`${this.apiUrl}/refresh-token`, { refreshToken }, { headers: headers }).pipe(
      map(data => {
        // Assuming the API returns a new access token, update it in the local storage
        this.saveToken(data.token);
        return data;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  
  isTokenExpired(): boolean {
    const token = this.token;
    if (token) {
      console.log(this.jwtHelper.isTokenExpired(token));
      return this.jwtHelper.isTokenExpired(token);
    }
    return true; // Token doesn't exist or is expired
  }
  
}
