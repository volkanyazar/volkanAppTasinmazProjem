import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasinmazService } from '../services/tasinmaz.service';
import { PageTitleService } from '../services/page-title.service';
import { Tasinmaz } from '../models/tasinmaz';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
import { TasinmazReportService } from '../services/tasinmaz-report.service';
import { Mahalle } from '../models/mahalle';
import { Il } from '../models/il';
import { Ilce } from '../models/ilce';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tasinmaz',
  templateUrl: './tasinmaz.component.html',
  styleUrls: ['./tasinmaz.component.css'],
  providers: [TasinmazService, TasinmazReportService]
})
export class TasinmazComponent implements OnInit {
  tasinmazlar: Tasinmaz[];
  currentPage = 1;
  itemsPerPage = 10;
  selectedTasinmazlarSpecific: Tasinmaz[];
  selectedTasinmazlar: Tasinmaz[] = [];
  pageSize = 10;
  pagedTasinmazlar: Tasinmaz[];
  searchText: string = '';
  mahalleler : Mahalle[] = [];
  iller : Il[] = [];
  ilceler : Ilce[] = [];
  tokenUserId = parseInt(this.authService.getIdentity().nameidentifier);

  tasinmazForm: FormGroup;

  constructor(
    private tasinmazService: TasinmazService,
    private tasinmazReportService: TasinmazReportService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private alertifyService: AlertifyService,
    private authService:AuthService
  ) {
    this.selectedTasinmazlar = this.tasinmazService.getSelectedTasinmazlar();
    this.selectedTasinmazlarSpecific = [];
 
   
  }

  ngOnInit() {
    this.pageTitleService.setPageTitle('Mevcut Taşınmazlar Listesi');
    this.tasinmazService.getMahalleler().subscribe(mahalleler=>{
      this.mahalleler = mahalleler["data"];
    });
    this.tasinmazService.getIller().subscribe(iller=>{
      this.iller = iller["data"];
    });
    this.tasinmazService.getIlceler().subscribe(ilceler=>{
      this.ilceler = ilceler["data"];
    });
    
    
    this.tasinmazService.getTasinmazByUserId(this.tokenUserId).subscribe(
      (data) => {
        this.tasinmazlar = data["data"];
        
        console.log('Tüm veriler:', this.tasinmazlar);
        this.tasinmazlar.sort((a, b) => a.tasinmazId - b.tasinmazId);

        this.updatePagedTasinmazlar();
        this.selectedTasinmazlar = this.tasinmazService.getSelectedTasinmazlar();
        console.log('Seçili Taşınmazlar:', this.selectedTasinmazlar);
      },
      (error) => {
        console.error('Veri alınamadı:', error);
      }
    );
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
  
  navigateToUpdateTasinmaz() {
    if (this.selectedTasinmazlar.length === 1) {
      // Seçili taşınmazı alın
      const selectedTasinmaz = this.selectedTasinmazlar[0];

      // Güncelleme sayfasına yönlendirin ve taşınmazın kimliğini parametre olarak iletilen id'ye atayın
      this.router.navigateByUrl('/tasinmaz/tasinmaz-update?id=' + selectedTasinmaz.tasinmazId);
    } else {
      // Seçili taşınmaz yoksa uyarı verin veya işlem yapın
      alert('Lütfen güncellemek için sadece bir adet taşınmaz seçin.');
    }
  }

  search() {
    if (this.searchText.trim() === '') {
      // Arama terimi boşsa, tüm verileri göster
      this.pagedTasinmazlar = this.tasinmazlar.slice(0, this.itemsPerPage);
    } else {
      // Arama terimi doluysa, filtrelemeyi uygula ve paginasyonu sıfırla
      const filteredTasinmazlar = this.tasinmazlar.filter((tasinmaz) => {
        return (
          (this.getIlName(tasinmaz.il).toLowerCase().includes(this.searchText.toLowerCase())) || 
          (this.getIlceName(tasinmaz.ilce).toLowerCase().includes(this.searchText.toLowerCase())) || 
          (this.getMahalleName(tasinmaz.mahalleId).toLowerCase().includes(this.searchText.toLowerCase())) || 
          (tasinmaz.ada && tasinmaz.ada.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (tasinmaz.parsel && tasinmaz.parsel.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (tasinmaz.nitelik && tasinmaz.nitelik.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (tasinmaz.adres && tasinmaz.adres.toLowerCase().includes(this.searchText.toLowerCase()))
        );
      });
  
      // Filtrelenen verileri paginatöre uygula
      this.pagedTasinmazlar = filteredTasinmazlar.slice(0, this.itemsPerPage);
    }
    // Sayfa numarasını sıfırla
    this.currentPage = 1;
  }
  
  changePage(event) {
    this.currentPage = event.pageIndex + 1;
    this.updatePagedTasinmazlar();
    
    this.selectedTasinmazlar = [];
    this.selectedTasinmazlarSpecific = [];
    this.tasinmazService.setSelectedTasinmazlar(this.selectedTasinmazlar);
  }
  

  onCheckboxClicked(event: any, tasinmaz: Tasinmaz) {
    if (event.target.checked) {
      console.log(tasinmaz);
      this.selectedTasinmazlar.push(tasinmaz);
      this.selectedTasinmazlarSpecific.push(tasinmaz);
      this.tasinmazService.setSelectedTasinmazlar(this.selectedTasinmazlar);
      console.log(this.selectedTasinmazlar[0].tasinmazId);
    } else {
      // Seçili değilse, seçili taşınmazları çıkarın
      const index = this.selectedTasinmazlar.findIndex((item) => item.tasinmazId === tasinmaz.tasinmazId);
      if (index !== -1) {
        this.selectedTasinmazlar.splice(index, 1);
        this.selectedTasinmazlarSpecific.splice(index, 1); // İlgili taşınmazı özel listeden de çıkarın
        this.tasinmazService.setSelectedTasinmazlar(this.selectedTasinmazlar);
      }
    }
  }

   generateReport() {
    if (this.selectedTasinmazlar.length !== 1) {
      this.alertifyService.error('Lütfen raporlamak için en az bir taşınmaz seçin.');
      return;
    }
    const dataToExport = this.selectedTasinmazlar.map((tasinmaz) => {
      return {
        'ID': tasinmaz.tasinmazId,
        'İL': this.getIlName(tasinmaz.il) ,
        'İLÇE': this.getIlceName(tasinmaz.ilce),
        'MAHALLE': this.getMahalleName(tasinmaz.mahalleId),
        'ADA': tasinmaz.ada,
        'PARSEL': tasinmaz.parsel,
        'NİTELİK': tasinmaz.nitelik,
        'ADRES': tasinmaz.adres
      };
    });
    this.tasinmazReportService.exportToExcel(dataToExport, 'tasinmazlar-rapor');
    this.alertifyService.success('Taşınmaz bilgileri raporları başarıyla iletildi...');
    // Veriyi Excel dosyasına dönüştürme işlemi
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Tasinmazlar Rapor');
    // XLSX.writeFile(wb, 'tasinmazlar-rapor.xlsx');
  }



  deleteSelectedTasinmaz() {
    if (this.selectedTasinmazlar.length > 0) {
      this.alertifyService.confirm("DİKKAT!",
        'Seçili taşınmaz veya taşınmazlara ait tüm bilgileri silmek istediğinize emin misiniz?',
        () => {
          // Kullanıcı Evet'i tıkladığında yapılacak işlemler
          this.selectedTasinmazlar.forEach((tasinmaz) => {
            // Seçili taşınmazları sil
            this.tasinmazService.deleteTasinmaz(tasinmaz.tasinmazId).subscribe(
              () => {
                this.tasinmazlar = this.tasinmazlar.filter((item) => item.tasinmazId !== tasinmaz.tasinmazId);
                this.updatePagedTasinmazlar();
                this.alertifyService.success('Taşınmaz Silme İşlemi Başarıyla Gerçekleşti.');
                console.log(`Taşınmaz ID ${tasinmaz.tasinmazId} başarıyla silindi.`);
              },
              (error) => {
                console.error(`Taşınmaz ID ${tasinmaz.tasinmazId} silinemedi:`, error);
                this.alertifyService.error('Taşınmaz silme işlemi başarısız...');
              }
            );
          });

          this.selectedTasinmazlar = [];
          this.selectedTasinmazlarSpecific = []; // Özel listeden de seçili taşınmazları çıkarın
        },
        () => {
          // Kullanıcı Hayır'ı tıkladığında yapılacak işlemler
          this.alertifyService.warning('Taşınmaz Silme İşlemini İptal Ettiniz...');
        }
      );
    } else {
      alert('Lütfen silmek için en az bir taşınmaz seçin.');
    }
  }


  updatePagedTasinmazlar() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedTasinmazlar = this.tasinmazlar.slice(startIndex, endIndex);
  }

  
}
