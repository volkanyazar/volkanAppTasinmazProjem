import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class UserReportService {
  constructor() {}

  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
      header: ['USERID', 'AD', 'SOYAD', 'E-MAİL', 'ROL', 'ADRES']
    });

    ws['A1'] = { v: 'USERID', s: { font: { bold: true } } };
    ws['B1'] = { v: 'AD', s: { font: { bold: true } } };
    ws['C1'] = { v: 'SOYAD', s: { font: { bold: true } } };
    ws['D1'] = { v: 'E-MAİL', s: { font: { bold: true } } };
    ws['E1'] = { v: 'ROL', s: { font: { bold: true } } };
    ws['F1'] = { v: 'ADRES', s: { font: { bold: true } } };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    // Tarih ve saat bilgisini alın
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace(/[-T]/g, '').replace(/:/g, '');

    // Dosya isminde tarih ve saat bilgisini ekleyin
    const finalFileName = `${fileName}-${formattedDate}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, 'Kullanıcılar Rapor');

    XLSX.writeFile(wb, finalFileName);
  }
}
