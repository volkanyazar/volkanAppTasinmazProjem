import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() {}

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }

  confirm(title: string, message: string, onConfirm: () => void, onCancel: () => void) {
    alertify.confirm(title, message,
      function() { onConfirm(); }, // Evet düğmesine tıklanınca çalışacak işlev
      function() { onCancel(); }  // Hayır düğmesine tıklanınca çalışacak işlev
    ).set('labels', { ok: 'Evet', cancel: 'Hayır' }); // Düğme etiketlerini ayarla
  }
}
