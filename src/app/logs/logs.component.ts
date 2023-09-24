import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../services/page-title.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
import { Log } from '../models/log';
import { LogService } from '../services/log.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
  providers: [LogService]
})
export class LogsComponent implements OnInit {
  logs: Log[];
  currentPage = 1;
  itemsPerPage = 10;
  pageSize = 10;
  pagedLogs: Log[];
  searchText: string = '';
  tokenUserId = parseInt(this.authService.getIdentity().nameidentifier);
  userId:number;

  constructor
  (
    private logService: LogService,
    private pageTitleService:PageTitleService,
    private authService:AuthService,
    private userService:UserService
  ) 
  { }

  setUserStatus(durum: boolean): string {
    return durum ==false?'Başarısız':'Başarılı';
  }

  ngOnInit() {
    this.pageTitleService.setPageTitle('Log İşlemleri');
    this.userService.getUserById(this.tokenUserId).subscribe((user) => {
      this.userId = user["data"].userId;
      this.authService.updateUserName(user["data"].firstName+" "+user["data"].lastName)
      console.log(this.userId);
      this.loadLogs();
    });
   
  }

  loadLogs(){
    this.logService.getAll().subscribe(
      (data) => {
        this.logs = data["data"];
        console.log('Tüm veriler:', this.logs);
        this.logs.sort((a, b) => b.logid - a.logid);

        this.updatePagedLogs();
      },
      (error) => {
        console.error('Veri alınamadı:', error);
      }
    );
  }
  changePage(event) {
    this.currentPage = event.pageIndex + 1;
    this.updatePagedLogs();
  }
  

  updatePagedLogs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedLogs = this.logs.slice(startIndex, endIndex);
  }

}
