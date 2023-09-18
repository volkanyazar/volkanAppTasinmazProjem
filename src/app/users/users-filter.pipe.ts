import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'usersFilter'
})
export class UsersFilterPipe implements PipeTransform {

  transform(users: User[], searchText: string): any[] {
    if (!users || !searchText) {
      return users;
    }

    searchText = searchText.toLowerCase();

    return users.filter((user) => {
      // Burada farklı filtreleme kriterlerini ekleyebilirsiniz
      if (
        (user.firstName && user.firstName.toLowerCase().includes(searchText)) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchText)) ||
        (user.email && user.email.toLowerCase().includes(searchText)) ||
        (user.role && user.role.toLowerCase().includes(searchText)) ||
        (user.adres && user.adres.toLowerCase().includes(searchText))
      ) {
        return true;
      }
      return false;
    });
  }

}
