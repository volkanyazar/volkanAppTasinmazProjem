import { Pipe, PipeTransform } from '@angular/core';
import { Tasinmaz } from '../models/tasinmaz';
import { Il } from '../models/il';
import { Ilce } from '../models/ilce';
import { Mahalle } from '../models/mahalle';
import { TasinmazService } from '../services/tasinmaz.service';

@Pipe({
  name: 'tasinmazFilter'
})
export class TasinmazFilterPipe implements PipeTransform {
  iller: Il[];
  ilceler: Ilce[];
  mahalleler: Mahalle[];

  constructor(private tasinmazService: TasinmazService) {
    // İlgili verileri burada alın
    this.tasinmazService.getMahalleler().subscribe(mahalleler => {
      this.mahalleler = mahalleler["data"];
    });

    this.tasinmazService.getIller().subscribe(iller => {
      this.iller = iller["data"];
    });

    this.tasinmazService.getIlceler().subscribe(ilceler => {
      this.ilceler = ilceler["data"];
    });
  }

  transform(tasinmazlar: Tasinmaz[], searchText: string): any[] {
    if (!tasinmazlar || !searchText) {
      return tasinmazlar;
    }

    searchText = searchText.toLowerCase();

    return tasinmazlar.filter((tasinmaz) => {
      
      if (
        (this.getIlName(tasinmaz.il).toLowerCase().includes(searchText)) || 
        (this.getIlceName(tasinmaz.ilce).toLowerCase().includes(searchText)) || 
        (this.getMahalleName(tasinmaz.mahalleId).toLowerCase().includes(searchText)) || 
        (tasinmaz.ada && tasinmaz.ada.toLowerCase().includes(searchText)) ||
        (tasinmaz.parsel && tasinmaz.parsel.toLowerCase().includes(searchText)) ||
        (tasinmaz.nitelik && tasinmaz.nitelik.toLowerCase().includes(searchText)) ||
        (tasinmaz.adres && tasinmaz.adres.toLowerCase().includes(searchText))
      ) {
        return true;
      }
      
      return false;
    });
  }

  getIlName(ilId: number): string {
    const il = this.iller.find((item) => item.ilId === ilId);
    return il ? il.ilName : '';
  }
  
  getIlceName(ilceId: number): string {
    const ilce = this.ilceler.find((item) => item.ilceId === ilceId);
    return ilce ? ilce.ilceName : '';
  }
  
  getMahalleName(mahalleId: number): string {
    const mahalle = this.mahalleler.find((item) => item.mahalleId === mahalleId);
    return mahalle ? mahalle.mahalleName : '';
  }
}
