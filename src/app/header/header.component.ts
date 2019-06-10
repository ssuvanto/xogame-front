import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() displayname: string
  @Output() login = new EventEmitter<Object>()

  doLogin(uname, pword){
    if(uname && pword){
      this.login.emit({uname: uname, pword: pword})
    }
  }

  logout() {
    this.login.emit({uname: '', pword: ''})
  }

}
