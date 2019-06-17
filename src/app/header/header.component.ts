import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  constructor(private user: UserService, private http: HttpClient) {}

  curr_user: User

  doLogin(uname, pword){
    if(uname && pword){
      this.http.post('http://localhost:4444/api/login', {uname: uname}).subscribe(res => {
        this.user.setUser(uname, res['token'])
        this.curr_user = {name: uname, token: res['token']}
      })
    }
  }

  logout() {
    this.user.clearUser()
    this.curr_user = null
  }

  ngOnInit() {
    this.curr_user = this.user.getUser()
  }

}
