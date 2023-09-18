import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserForLoginDto } from '../dtos/userForLoginDto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const userForLoginDto: UserForLoginDto = {
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value
      };

      this.authService.login(userForLoginDto);
      console.log(userForLoginDto);
    }
  }

  logOut(){
    this.authService.logOut();
  }

  get isAuthenticated(){
    return this.authService.loggedIn();
  }
}
