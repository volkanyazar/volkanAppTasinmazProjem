import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../services/page-title.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
import { Log } from '../models/log';
import { LogService } from '../services/log.service';

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

  constructor
  (
    private logService: LogService,
    private pageTitleService:PageTitleService
  ) 
  { }

  setUserStatus(durum: boolean): string {
    return durum ==false?'Pasif':'Aktif';
  }

  ngOnInit() {
    this.pageTitleService.setPageTitle('Log İşlemleri');
    this.logService.getAll().subscribe(
      (data) => {
        this.logs = data["data"];
        console.log('Tüm veriler:', this.logs);
        this.logs.sort((a, b) => a.logid - b.logid);

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
