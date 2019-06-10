import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private user: UserService) {}

  @Input() displayname: string
  @Output() login = new EventEmitter<Object>()

  doLogin(uname, pword){
    if(uname && pword){
      //this.login.emit({uname: uname, pword: pword})
      this.user.name = uname
    }
  }

  logout() {
    //this.login.emit({uname: '', pword: ''})
    this.user.name = ''
  }

}
