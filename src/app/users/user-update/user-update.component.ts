import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { HashingHelperService } from 'src/app/services/hashing-helper.service';
import { PageTitleService } from 'src/app/services/page-title.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {

  userForm: FormGroup;
  updatedUser: User = new User();
  selectedUsers: User[] = [];

  constructor(
    private pageTitleService: PageTitleService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {

    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', Validators.required],
      role: ['', Validators.required],
      adres: ['', Validators.required]
    });
    
  }

  ngOnInit() {
    this.pageTitleService.setPageTitle('Kullanıcı Bilgilerini Güncelle');

    this.route.queryParams.subscribe(params => {
      const userId = +params['id'];
      
      this.userService.getUserById(userId).subscribe(
        (user: User) => {
          this.updatedUser = user["data"];
          this.selectedUsers[0] = this.updatedUser;
          console.log(this.userService.getSelectedUsers());
          this.fillFormWithUserData();
        },
        (error) => {
          console.error('Kullanıcı alınamadı:', error);
        }
      );
    });

    this.selectedUsers = this.userService.getSelectedUsers();
    console.log(this.userService.getSelectedUsers());
    console.log(this.selectedUsers);
    if (this.selectedUsers.length === 1) {
      const firstSelectedUser = this.selectedUsers[0];
      this.userForm.patchValue({
        firstName: firstSelectedUser.firstName,
        lastName: firstSelectedUser.lastName,
        email: firstSelectedUser.email,
        newPassword: '', // newPassword olarak değiştirildi
        role: firstSelectedUser.role,
        adres: firstSelectedUser.adres
      });
    }
  }

  fillFormWithUserData() {
    if (this.updatedUser) {
      this.userForm.setValue({
        firstName: this.updatedUser.firstName || '',
        lastName: this.updatedUser.lastName || '',
        email: this.updatedUser.email || '',
        newPassword: '',
        role: this.updatedUser.role || '',
        adres: this.updatedUser.adres || ''
      });
    }
  }

  updateUser() {
    if (this.userForm.valid) {
      this.alertifyService.confirm("UYARI!",
        'Seçili kullanıcıya ait bilgileri güncellemek istediğinize emin misiniz?',
        () => {
          const newPassword = this.userForm.get('newPassword').value;
          const status = true;
          this.updatedUser = Object.assign({}, this.userForm.value);
          this.updatedUser.userId = this.selectedUsers[0].userId;
  
          if (newPassword) {
            this.updatedUser.status = status;
          }
  
          this.userService.updateUser(this.updatedUser).subscribe(
            (response) => {
              console.log('Kullanıcı Başarıyla Güncellendi:', response);
              this.alertifyService.success('Seçili kullanıcıya ait güncelleme işlemi başarı ile gerçekleşti');
              this.router.navigateByUrl('/kullanici-islemleri');
            },
            (error) => {
              console.error('Kullanıcı güncelleme başarısız:', error);
              this.alertifyService.error('Kullanıcı güncelleme başarısız: ' + error);
            }
          );
        },
        () => {
          // Kullanıcı "Hayır" derse, işlemi iptal edin
          this.alertifyService.warning("Kullanıcı Güncelleme İşlemini İptal Ettiniz...");
          console.log('Kullanıcı güncelleme işlemi iptal edildi.');
        }
      );
    } else {
      console.error('Form geçerli değil. Kullanıcı güncellenemedi.');
      this.alertifyService.error('Form geçerli değil. Kullanıcı güncellenemedi.');
    }
  }
  
}
