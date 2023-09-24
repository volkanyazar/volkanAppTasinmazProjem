import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../services/page-title.service';
import { User } from '../models/user';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';
import { UserReportService } from '../services/user-report.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, UserReportService]
})
export class UsersComponent implements OnInit {
  users: User[];
  currentPage = 1;
  itemsPerPage = 10;
  selectedUsersSpecific: User[];
  selectedUsers: User[] = [];
  pageSize = 10;
  pagedUsers: User[];
  searchText: string = '';
  tokenUserId = parseInt(this.authService.getIdentity().nameidentifier);
  userId:number;

  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService:AuthService,
    private userReportService: UserReportService,
    private pageTitleService:PageTitleService,
    private router: Router,
    private alertifyService: AlertifyService
    )
   {
    this.selectedUsers = this.userService.getSelectedUsers();
    this.selectedUsersSpecific = [];
   }

  ngOnInit() {
    this.pageTitleService.setPageTitle('Kullanıcı İşlemleri');
    this.userService.getUserById(this.tokenUserId).subscribe((user) => {
      this.userId = user["data"].userId;
      this.authService.updateUserName(user["data"].firstName+" "+user["data"].lastName)
      console.log(this.userId);
      this.loadUsers();
    });

  }

  loadUsers(){
    this.userService.getAll().subscribe(
      (data) => {
        this.users = data;
        console.log('Tüm veriler:', this.users);
        this.users.sort((a, b) => a.userId - b.userId);

        this.updatePagedUsers();
        this.selectedUsers = this.userService.getSelectedUsers();
        console.log('Seçili Kullanıcılar:', this.selectedUsers);
      },
      (error) => {
        console.error('Veri alınamadı:', error);
      }
    );
  }
  navigateToAddUser() {
    this.router.navigateByUrl('/kullanici-islemleri/user-add');
  }

  navigateToUpdateUser() {
    if (this.selectedUsers.length === 1) {
      const selectedUser = this.selectedUsers[0];
      // Doğru kullanıcı ID'sini alarak güncelleme sayfasına yönlendirin
      this.router.navigate(['kullanici-islemleri/user-update'], { queryParams: { id: selectedUser.userId } });
    } else {
      this.alertifyService.error('Lütfen güncellemek için sadece bir adet kullanıcı seçin.');
    }
  }

  search() {
    if (this.searchText.trim() === '') {
      this.pagedUsers = this.users.slice(0, this.itemsPerPage);
    } else {
      const filteredUsers = this.users.filter((user) => {
        return (
          (user.firstName && user.firstName.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (user.lastName && user.lastName.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (user.role && user.role.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (user.adres && user.adres.toLowerCase().includes(this.searchText.toLowerCase()))
        );
      });
  
      this.pagedUsers = filteredUsers.slice(0, this.itemsPerPage);
    }
    this.currentPage = 1;
  }
  
  changePage(event) {
    this.currentPage = event.pageIndex + 1;
    this.updatePagedUsers();
    
    this.selectedUsers = [];
    this.selectedUsersSpecific = [];
    this.userService.setSelectedUsers(this.selectedUsers);
  }
  

  onCheckboxClicked(event: any, user: User) {
    if (event.target.checked) {
      console.log(user);
      this.selectedUsers.push(user);
      this.selectedUsersSpecific.push(user);
      this.userService.setSelectedUsers(this.selectedUsers);
      console.log(this.selectedUsers[0].userId);
    } else {
      const index = this.selectedUsers.findIndex((item) => item.userId === user.userId);
      if (index !== -1) {
        this.selectedUsers.splice(index, 1);
        this.selectedUsersSpecific.splice(index, 1); // İlgili taşınmazı özel listeden de çıkarın
        this.userService.setSelectedUsers(this.selectedUsers);
      }
    }
  }

   generateReport() {
    if (this.selectedUsers.length !== 1) {
      this.alertifyService.error('Lütfen raporlamak için en az bir kullanıcı seçin.');
      return;
    }
    //console.log(this.selectedUsers.length);
    const dataToExport = this.selectedUsers.map((user) => {
      return {
        'USERID': user.userId,
        'AD': user.firstName,
        'SOYAD': user.lastName,
        'E-MAİL': user.email,
        'ROL': user.role,
        'ADRES': user.adres
      };
    });
    this.userReportService.exportToExcel(dataToExport, 'kullanicilar-rapor');
    this.alertifyService.success('Kullanıcı bilgileri raporları başarıyla iletildi...');
    // Veriyi Excel dosyasına dönüştürme işlemi
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Tasinmazlar Rapor');
    // XLSX.writeFile(wb, 'tasinmazlar-rapor.xlsx');
  }



  deleteSelectedUsers() {
    if (this.selectedUsers.length > 0) {
      this.alertifyService.confirm("DİKKAT!",
        'Seçili kullanıcı veya kullanıcılara ait tüm bilgileri silmek istediğinize emin misiniz?',
        () => {
          const deletionPromises = this.selectedUsers.map((user) => {
            console.log(user.userId);
            return this.userService.deleteUser(user.userId).toPromise()
              .then(() => true) // Başarılı silme işlemi
              .catch(() => false); // Silme hatası
          });
  
          Promise.all(deletionPromises).then((results) => {
            results.forEach((result, index) => {
              if (result) {
                // Başarı mesajı göster
                this.alertifyService.success(`Kullanıcı ID ${this.selectedUsers[index].userId} başarıyla silindi.`);
                // Kullanıcıları yerel listeden kaldır
                this.users = this.users.filter((item) => item.userId !== this.selectedUsers[index].userId);
                this.updatePagedUsers();
              } else {
                // Hata mesajı göster
                this.alertifyService.error(`Kullanıcı ID ${this.selectedUsers[index].userId} silinemedi.`);
              }
            });
  
            this.selectedUsers = [];
            this.selectedUsersSpecific = [];
          }).catch((error) => {
            console.error('Silme işlemi sırasında hata oluştu:', error);
            this.alertifyService.error('Silme işlemi sırasında bir hata oluştu.');
          });
        },
        () => {
          // Kullanıcı "Hayır" derse, işlemi iptal edin
          this.alertifyService.warning('Kullanıcı Silme İşlemini İptal Ettiniz...');
        }
      );
    } else {
      this.alertifyService.error('Lütfen silmek için en az bir kullanıcı seçin.');
    }
  }
  
  
  

  updatePagedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

}
