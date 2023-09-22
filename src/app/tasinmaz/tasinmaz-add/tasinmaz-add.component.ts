import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from 'src/app/services/page-title.service';
import { TasinmazService } from 'src/app/services/tasinmaz.service';
import { Tasinmaz } from 'src/app/models/tasinmaz';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { CoordinateService } from 'src/app/services/coordinate-service.service';
import { TasinmazMapComponent } from '../tasinmaz-map/tasinmaz-map.component';

@Component({
  selector: 'app-tasinmaz-add',
  templateUrl: './tasinmaz-add.component.html',
  styleUrls: ['./tasinmaz-add.component.css']
})
export class TasinmazAddComponent implements OnInit {
  tasinmazForm: FormGroup;
  @ViewChild(TasinmazMapComponent) mapComponent: TasinmazMapComponent;
  newTasinmaz: Tasinmaz = new Tasinmaz();
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  user = {};
  tokenUserId = this.authService.getIdentity().nameidentifier;

  constructor(
    private pageTitleService: PageTitleService,
    private formBuilder: FormBuilder,
    private router: Router,
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
      ada: ['', Validators.required], // 4 haneli sayılar için validator
      parsel: ['', Validators.required], // 4 haneli sayılar için validator
      nitelik: ['', Validators.required],
      adres: ['', Validators.required],
      coorX: [{ value: '', disabled: true }, Validators.required],
      coorY: [{ value: '', disabled: true }, Validators.required]
    });
    
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

  ngOnInit() {
    this.pageTitleService.setPageTitle('Yeni Taşınmaz Ekle');
    this.tasinmazService.getIller().subscribe(iller =>{
      this.iller = iller["data"];
    });

     // Diğer başlangıç işlemleri
  this.coordinateService.coordinate$.subscribe((coordinates) => {
    // Koordinatları burada kullanabilirsiniz.
    const [x, y] = coordinates;
    
    if(this.mapComponent.markedTasinmazlar.length>0){
      const lastMarkedFeature = this.mapComponent.markedTasinmazlar.pop(); // En son işareti çıkar
    this.mapComponent.vectorSource.removeFeature(lastMarkedFeature); // Vektör kaynağından kaldır
    }
    // Örneğin, bu koordinatları form kontrollerine yerleştirebilirsiniz.
    this.tasinmazForm.get('coorX').setValue(x);
    this.tasinmazForm.get('coorY').setValue(y);
  });
  }

  addTasinmaz() {
    if (this.tasinmazForm.valid) {
      // Kullanıcıya onay için bir iletişim kutusu (confirm dialog) gösterimi
      this.alertifyService.confirm("UYARI!",
        'Yeni taşınmazı eklemek istediğinize emin misiniz?',
        () => {
          this.user = this.userService.getUserById(parseInt(this.tokenUserId));
          // Kullanıcı "Evet" derse, taşınmazı ekleyin
          this.newTasinmaz = Object.assign({}, this.tasinmazForm.value);
          this.newTasinmaz.ilce = parseInt(this.tasinmazForm.get('ilce').value);
          this.newTasinmaz.il = parseInt(this.tasinmazForm.get('il').value);
          this.newTasinmaz.mahalleId = parseInt(this.tasinmazForm.get('mahalleId').value);
          this.newTasinmaz.userId = parseInt(this.tokenUserId);
          this.newTasinmaz.coorX = this.tasinmazForm.get('coorX').value.toString();
          this.newTasinmaz.coorY = this.tasinmazForm.get('coorY').value.toString();

  
          console.log(this.newTasinmaz);
          this.tasinmazService.addTasinmaz(this.newTasinmaz).subscribe(
            (response) => {
              console.log('Taşınmaz Başarıyla Eklendi:', response);
              this.alertifyService.success('Taşınmaz Ekleme İşlemi Başarıyla Gerçekleşti.');
              this.router.navigateByUrl('/tasinmaz');
            },
            (error) => {
              console.error('Tasinmaz ekleme başarısız..:', error);
              this.alertifyService.error(error);
            }
          );
        },
        () => {
          // Kullanıcı "Hayır" derse, işlemi iptal edin
          this.alertifyService.warning("Taşınmaz Ekleme İşlemini İptal Ettiniz...");
          console.log('Taşınmaz ekleme işlemi iptal edildi.');
        }
      );
    } else {
      // Form geçerli değilse kullanıcıya bir hata gösterin veya başka bir işlem yapın
      console.error('Form geçerli değil. Taşınmaz eklenemedi.');
      this.alertifyService.error('Form geçerli değil. Taşınmaz eklenemedi.');
    }
  }
}
