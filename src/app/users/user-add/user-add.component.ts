import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserForRegisterDto } from 'src/app/dtos/userForRegisterDto';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { HashingHelperService } from 'src/app/services/hashing-helper.service';
import { PageTitleService } from 'src/app/services/page-title.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  userForm: FormGroup;
  newUser: User = new User();
  tokenUserId = parseInt(this.authService.getIdentity().nameidentifier);
  userId:number;
  
  constructor(
    private pageTitleService: PageTitleService,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private router: Router,
    private userService: UserService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.pageTitleService.setPageTitle('Yeni Kullanıcı Ekle');
    this.userService.getUserById(this.tokenUserId).subscribe((user) => {
      this.userId = user["data"].userId;
      this.authService.updateUserName(user["data"].firstName+" "+user["data"].lastName)
      console.log(this.userId);
    });
    this.createUserForm();
  }

  createUserForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      adres: ['', Validators.required]
    });
  }

  addUser() {
    if (this.userForm.valid) {
      this.alertifyService.confirm(
        "UYARI!",
        'Yeni kullanıcı eklemek istediğinize emin misiniz?',
        () => {
          const newUser: UserForRegisterDto = {
            email: this.userForm.get('email').value,
            password: this.userForm.get('password').value,
            firstName: this.userForm.get('firstName').value,
            lastName: this.userForm.get('lastName').value,
            role: this.userForm.get('role').value,
            adres: this.userForm.get('adres').value
          };
  
          this.authService.register(newUser, newUser.password ).subscribe(
            (response: any) => {
              console.log('Kullanıcı Başarıyla Eklendi:', response);
              this.alertifyService.success('Kullanıcı Ekleme İşlemi Başarıyla Gerçekleşti.');
              this.router.navigateByUrl('/kullanici-islemleri');
            },
            (error) => {
              console.error('Kullanıcı ekleme başarısız:', error);
              this.alertifyService.error(error);
            }
          );
        },
        () => {
          // Kullanıcı "Hayır" derse, işlemi iptal edin
          this.alertifyService.warning('Kullanıcı Ekleme İşlemini İptal Ettiniz...');
          console.log('Kullanıcı ekleme işlemi iptal edildi.');
        }
      );
    } else {
      // Form geçerli değilse kullanıcıya bir hata gösterin veya başka bir işlem yapın
      console.error('Form geçerli değil. Kullanıcı eklenemedi.');
      this.alertifyService.error('Form geçerli değil. Kullanıcı eklenemedi.');
    }
  }
  
  
}
