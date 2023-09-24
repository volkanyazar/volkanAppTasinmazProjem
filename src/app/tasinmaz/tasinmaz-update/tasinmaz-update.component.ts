import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // ActivatedRoute eklenmiştir
import { Tasinmaz } from 'src/app/models/tasinmaz';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { CoordinateService } from 'src/app/services/coordinate-service.service';
import { PageTitleService } from 'src/app/services/page-title.service';
import { TasinmazService } from 'src/app/services/tasinmaz.service';
import { TasinmazMapComponent } from '../tasinmaz-map/tasinmaz-map.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tasinmaz-update',
  templateUrl: './tasinmaz-update.component.html',
  styleUrls: ['./tasinmaz-update.component.css']
})
export class TasinmazUpdateComponent implements OnInit {

  tasinmazForm: FormGroup;
  @ViewChild(TasinmazMapComponent) mapComponent: TasinmazMapComponent;
  updatedTasinmaz: Tasinmaz = new Tasinmaz();
  selectedTasinmazlar: Tasinmaz[] = [];
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  tokenUserId = this.authService.getIdentity().nameidentifier;
  userId:number;

  constructor(
    private pageTitleService: PageTitleService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, // parametreli routeler için
    private tasinmazService: TasinmazService,
    private alertifyService: AlertifyService,
    private authService:AuthService,
    private userService:UserService,
    private coordinateService:CoordinateService
  ) {

    this.tasinmazForm = this.formBuilder.group({
      il: ['', Validators.required],
      ilce: ['', Validators.required],
      mahalleId: ['', Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      nitelik: ['', Validators.required],
      adres: ['', Validators.required],
      coorX: [{ value: '', disabled: true }, Validators.required],
      coorY: [{ value: '', disabled: true }, Validators.required]
    });
    
  }
  
    
  ngOnInit() {
    this.pageTitleService.setPageTitle('Taşınmaz Güncelle');
    this.userService.getUserById(parseInt(this.tokenUserId)).subscribe((user) => {
      this.userId = user["data"].userId;
      this.authService.updateUserName(user["data"].firstName+" "+user["data"].lastName)
      console.log(this.userId);
    });
    this.route.queryParams.subscribe(params => {
      const tasinmazId = +params['id'];
      
      // İlgili taşınmazı almak için servisi kullanın
      this.tasinmazService.getTasinmazById(tasinmazId).subscribe(
        (tasinmaz: Tasinmaz) => {
          this.updatedTasinmaz = tasinmaz["data"];
          console.log(this.updatedTasinmaz);
          this.selectedTasinmazlar[0] = this.updatedTasinmaz;
          console.log(this.tasinmazService.getSelectedTasinmazlar());
          this.fillFormWithTasinmazData();
        this.mapComponent.markTasinmazAtCoordinates([parseFloat(this.updatedTasinmaz.coorX), parseFloat(this.updatedTasinmaz.coorY)]);  

          // Koordinatları forma doldurun
       // this.tasinmazForm.get('coorX').setValue(this.updatedTasinmaz.coorX);
       // this.tasinmazForm.get('coorY').setValue(this.updatedTasinmaz.coorY);
        },
        (error) => {
          console.error('Tasinmaz alınamadı:', error);
        }
      );
    });

    this.tasinmazService.getIller().subscribe(iller =>{
      this.iller = iller["data"];
    });

    this.selectedTasinmazlar = this.tasinmazService.getSelectedTasinmazlar();
    console.log(this.tasinmazService.getSelectedTasinmazlar());
    console.log(this.selectedTasinmazlar);
    if (this.selectedTasinmazlar.length === 1) {
      // İlk seçili taşınmazı alın ve form alanlarına yerleştirin
      const firstSelectedTasinmaz = this.selectedTasinmazlar[0];
      this.tasinmazForm.patchValue({
        il: firstSelectedTasinmaz.il,
        ilce: firstSelectedTasinmaz.ilce,
        mahalleId: firstSelectedTasinmaz.mahalleId,
        ada: firstSelectedTasinmaz.ada,
        parsel: firstSelectedTasinmaz.parsel,
        nitelik: firstSelectedTasinmaz.nitelik,
        adres: firstSelectedTasinmaz.adres,
        coorX: firstSelectedTasinmaz.coorX,
        coorY: firstSelectedTasinmaz.coorY
      });
    }
         // Diğer başlangıç işlemleri
  this.coordinateService.coordinate$.subscribe((coordinates) => {
    // Koordinatları burada kullanabilirsiniz.
    const [x, y] = coordinates;
    // Örneğin, bu koordinatları form kontrollerine yerleştirebilirsiniz.
    if(this.mapComponent.markedTasinmazlar.length>0){
      const lastMarkedFeature = this.mapComponent.markedTasinmazlar.pop(); // En son işareti çıkar
    this.mapComponent.vectorSource.removeFeature(lastMarkedFeature); // Vektör kaynağından kaldır
    }
    this.tasinmazForm.get('coorX').setValue(x);
    this.tasinmazForm.get('coorY').setValue(y);
   
  });
  this.mapComponent.allowTakeCoordinate = false;
  }

 // İl seçimi değiştiğinde
onIlChange() {
  const selectedIl = this.tasinmazForm.get('il').value;
  this.tasinmazService.getIlcelerByIlId(selectedIl).subscribe(ilceler => {
    this.ilceler = ilceler;
  });
}

// İlçe seçimi değiştiğinde
onIlceChange() {
  const selectedIlce = this.tasinmazForm.get('ilce').value;
  this.tasinmazService.getMahallelerByIlceId(selectedIlce).subscribe(mahalleler => {
    this.mahalleler = mahalleler;
  });
}



  fillFormWithTasinmazData() {
    // Seçilen taşınmazın verilerini forma doldurun
    if (this.updatedTasinmaz) {
      this.tasinmazForm.setValue({
        il: this.updatedTasinmaz.il || '', // Varsa 'il' verisini kullan, yoksa boş bir dize kullan
        ilce: this.updatedTasinmaz.ilce || '',
        mahalleId: this.updatedTasinmaz.mahalleId || '',
        ada: this.updatedTasinmaz.ada || '',
        parsel: this.updatedTasinmaz.parsel || '',
        nitelik: this.updatedTasinmaz.nitelik || '',
        adres: this.updatedTasinmaz.adres || '',
        coorX: this.updatedTasinmaz.coorX || '',
        coorY: this.updatedTasinmaz.coorY || ''
      });
    }
  }

  updateTasinmaz() {
    if (this.tasinmazForm.valid) {
      // Kullanıcıya onay için bir iletişim kutusu (confirm dialog) gösterimi
      this.alertifyService.confirm("UYARI!",
        'Seçili taşınmaza ait bilgileri güncellemek istediğinize emin misiniz?',
        () => {
          // Kullanıcı "Evet" derse, taşınmazı güncelleyin
          this.updatedTasinmaz = Object.assign({}, this.tasinmazForm.value);
          this.updatedTasinmaz.tasinmazId = this.selectedTasinmazlar[0].tasinmazId;
          this.updatedTasinmaz.ilce = parseInt(this.tasinmazForm.get('ilce').value);
          this.updatedTasinmaz.il = parseInt(this.tasinmazForm.get('il').value);
          this.updatedTasinmaz.mahalleId = parseInt(this.tasinmazForm.get('mahalleId').value);
          this.updatedTasinmaz.userId = parseInt(this.tokenUserId);
          this.updatedTasinmaz.coorX = this.tasinmazForm.get('coorX').value.toString();
          this.updatedTasinmaz.coorY = this.tasinmazForm.get('coorY').value.toString();

          // this.updatedTasinmaz.user = this.tasinmazService.getTasinmazByUserId(this.tokenUserId); //Todo
          console.log(this.updatedTasinmaz); // Taşınmaz ID
  
          this.tasinmazService.updateTasinmaz(this.updatedTasinmaz).subscribe(
            (response) => {
              console.log('Taşınmaz Başarıyla Güncellendi:', response);
              this.alertifyService.success('Seçili taşınmaza ait güncelleme işlemi başarı ile gerçekleşti');
              this.router.navigateByUrl('/tasinmaz');
            },
            (error) => {
              console.error('Tasinmaz güncelleme başarısız:', error);
              this.alertifyService.error('Tasinmaz güncelleme başarısız: ' + error);
            }
          );
        },
        () => {
          // Kullanıcı "Hayır" derse, işlemi iptal edin
          this.alertifyService.warning("Taşınmaz Güncelleme İşlemini İptal Ettiniz...");
          console.log('Taşınmaz güncelleme işlemi iptal edildi.');
        }
      );
    } else {
      // Form geçerli değilse kullanıcıya bir hata gösterin veya başka bir işlem yapın
      console.error('Form geçerli değil. Taşınmaz güncellenemedi.');
      this.alertifyService.error('Form geçerli değil. Taşınmaz güncellenemedi.');
    }
  }
  
}
