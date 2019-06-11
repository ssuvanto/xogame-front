import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private user: UserService) {}

  doLogin(uname, pword){
    if(uname && pword){
      this.user.name = uname
    }
  }

  logout() {
    this.user.name = ''
  }

}
