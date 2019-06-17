import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  name: string
  
  getUser():User {
      const name = localStorage.getItem('uname')
      const token = localStorage.getItem('token')
      if(name && token){
        return {name: name, token: token}
      }
      return null
  }

  setUser(name: string, token: string) {
    localStorage.setItem('uname', name)
    localStorage.setItem('token', token)
  }

  clearUser() {
    localStorage.removeItem('uname')
    localStorage.removeItem('token')
  }
}

export interface User {
  name: string,
  token: string
}
