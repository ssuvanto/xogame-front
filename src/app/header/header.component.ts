import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private user: UserService, private http: HttpClient) {}
  login_error: string

  doLogin(uname, pword){
    if(uname && pword){
      this.http.post('http://localhost:4444/api/login', {
        uname: uname,
        pword: pword
      }, {
        observe: 'response'
      }).subscribe(
        res => {
          if(res.status === 200){
            this.login_error = null
            this.user.user = {name: uname, token: res.body['token']}
            window.location.reload()
          }
        },
        err => {
          this.login_error = err.error.error
        }
      )
    }
  }

  logout() {
    this.user.user = null
  }

}
