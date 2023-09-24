import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Log } from 'src/app/models/log';
import { AlertifyService } from 'src/app/services/alertify.service';
import { LogService } from 'src/app/services/log.service';
import * as XLSX from 'xlsx';
import { PageTitleService } from 'src/app/services/page-title.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.css']
})
export class LogDetailComponent implements OnInit {
  logs: Log[];
  currentPage = 1;
  itemsPerPage = 10;
  selectedLogsSpecific: Log[];
  selectedLogs: Log[] = [];
  pageSize = 10;
  pagedLogs: Log[];
  searchText: string = '';
  tokenUserId = parseInt(this.authService.getIdentity().nameidentifier);
  userId:number;

  @ViewChild('printSection') printSection: ElementRef;

  constructor(
    private logService: LogService,
    private pageTitleService:PageTitleService,
    private alertifyService: AlertifyService,
    private userService:UserService,
    private authService:AuthService
    ) 
    {
      this.selectedLogs = this.logService.getSelectedLogs();
      this.selectedLogsSpecific = [];
    }

  ngOnInit() {
    this.pageTitleService.setPageTitle('Log Detayları');
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
        this.selectedLogs = this.logService.getSelectedLogs();
        console.log('Seçili Kullanıcılar:', this.selectedLogs);
      },
      (error) => {
        console.error('Veri alınamadı:', error);
      }
    );
  }
  search() {
    if (this.searchText.trim() === '') {
      this.pagedLogs = this.logs.slice(0, this.itemsPerPage);
    } else {
      const filteredLogs = this.logs.filter((log) => {
        return (
          ((log.durum === true && 'başarılı'.includes(this.searchText)) || 
          (log.durum === false && 'başarısız'.includes(this.searchText))) ||
          (log.userid && log.userid.toString().includes(this.searchText.toLowerCase())) || 
          (log.islemtipi && log.islemtipi.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (log.tarih && log.tarih.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (log.logip && log.logip.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (log.aciklama && log.aciklama.toLowerCase().includes(this.searchText.toLowerCase()))
        );
      });
  
      this.pagedLogs = filteredLogs.slice(0, this.itemsPerPage);
    }
    this.currentPage = 1;
  }
  
  changePage(event) {
    this.currentPage = event.pageIndex + 1;
    this.updatePagedLogs();
    
    this.selectedLogs = [];
    this.selectedLogsSpecific = [];
    this.logService.setSelectedLogs(this.selectedLogs);
  }
  
  setUserStatus(durum: boolean): string {
    return durum ==false?'Başarısız':'Başarılı';
  }
  onCheckboxClicked(event: any, log: Log) {
    if (event.target.checked) {
      console.log(log);
      this.selectedLogs.push(log);
      this.selectedLogsSpecific.push(log);
      this.logService.setSelectedLogs(this.selectedLogs);
      console.log(this.selectedLogs[0].logid);
    } else {
      const index = this.selectedLogs.findIndex((item) => item.logid === log.logid);
      if (index !== -1) {
        this.selectedLogs.splice(index, 1);
        this.selectedLogsSpecific.splice(index, 1); 
        this.logService.setSelectedLogs(this.selectedLogs);
      }
    }
  }
 
  printLogs() {
    if (this.selectedLogs.length === 0) {
      this.alertifyService.error('En az bir adet log kaydı seçiniz...');
      return;
    }
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace(/[-T]/g, '').replace(/:/g, '');
  
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  
    const logsData = this.selectedLogs.map((log) => {
      return {
        'Durum': log.durum,
        'Kullanıcı ID': log.userid,
        'İşlem Tipi': log.islemtipi,
        'Tarih/Saat': log.tarih,
        'IP': log.logip,
        'Açıklama': log.aciklama,
      };
    });
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(logsData);
  
    worksheet['A1'] = { v: 'Durum', s: { font: { bold: true } } };
    worksheet['B1'] = { v: 'Kullanıcı ID', s: { font: { bold: true } } };
    worksheet['C1'] = { v: 'İşlem Tipi', s: { font: { bold: true } } };
    worksheet['D1'] = { v: 'Tarih/Saat', s: { font: { bold: true } } };
    worksheet['E1'] = { v: 'IP', s: { font: { bold: true } } };
    worksheet['F1'] = { v: 'Açıklama', s: { font: { bold: true } } };
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Log Raporu');
  
    const excelBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    const fileName = `log-raporu-${formattedDate}.xlsx`;
  
    const file = new File([excelBlob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  
    this.alertifyService.success('Log Kayıtları İletildi...');
  }

  updatePagedLogs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedLogs = this.logs.slice(startIndex, endIndex);
  }

}

