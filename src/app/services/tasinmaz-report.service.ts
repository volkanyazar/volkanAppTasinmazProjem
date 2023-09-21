import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class TasinmazReportService {
  constructor() {}

  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
      header: ['ID', 'İL', 'İLÇE', 'MAHALLE', 'ADA', 'PARSEL', 'NİTELİK', 'ADRES','X','Y'] 
    });

    ws['A1'] = { v: 'ID', s: { font: { bold: true } } };
    ws['B1'] = { v: 'İL', s: { font: { bold: true } } };
    ws['C1'] = { v: 'İLÇE', s: { font: { bold: true } } };
    ws['D1'] = { v: 'MAHALLE', s: { font: { bold: true } } };
    ws['E1'] = { v: 'ADA', s: { font: { bold: true } } };
    ws['F1'] = { v: 'PARSEL', s: { font: { bold: true } } };
    ws['G1'] = { v: 'NİTELİK', s: { font: { bold: true } } };
    ws['H1'] = { v: 'ADRES', s: { font: { bold: true } } };
    ws['I1'] = { v: 'X', s: { font: { bold: true } } };
    ws['J1'] = { v: 'Y', s: { font: { bold: true } } };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    // Tarih ve saat bilgisini alın
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace(/[-T]/g, '').replace(/:/g, '');

    // Dosya isminde tarih ve saat bilgisini ekleyin
    const finalFileName = `${fileName}-${formattedDate}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, 'Tasinmazlar Rapor');

    XLSX.writeFile(wb, finalFileName);
  }
}
