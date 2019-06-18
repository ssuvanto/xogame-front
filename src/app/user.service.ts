import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService { 
  _user: User
  get user():User {
    if(this._user){
      return this._user
    }
    const name = localStorage.getItem('uname')
    const token = localStorage.getItem('token')
    if(name && token){
      this._user = {name: name, token: token}
      return this._user
    }
    return null
  }

  set user(user) {
    if(user){
      localStorage.setItem('uname', user.name)
      localStorage.setItem('token', user.token)
    } else {
      localStorage.removeItem('uname')
      localStorage.removeItem('token')
    }
    this._user = user
  }
}

export interface User {
  name: string,
  token: string
}
