import { Pipe, PipeTransform } from '@angular/core';
import { Log } from 'src/app/models/log';

@Pipe({
  name: 'logdetailsFilter'
})
export class LogdetailsFilterPipe implements PipeTransform {

  transform(logs: Log[], searchText: string): any[] {
    if (!logs || !searchText) {
      return logs;
    }

    searchText = searchText.toLowerCase();

    return logs.filter((log) => {
      // Burada farklı filtreleme kriterlerini ekleyebilirsiniz
      if (
        (log.userid && log.userid.toString().includes(searchText)) || 
        (log.islemtipi && log.islemtipi.toLowerCase().includes(searchText)) ||
        (log.tarih && log.tarih.toLowerCase().includes(searchText)) ||
        (log.logip && log.logip.toLowerCase().includes(searchText)) ||
        (log.aciklama && log.aciklama.toLowerCase().includes(searchText)) ||
        ((log.durum === true && 'aktif'.includes(searchText)) ||
        (log.durum === false && 'pasif'.includes(searchText))) 
      ) {
        return true;
      }
      return false;
    });
  }
}
