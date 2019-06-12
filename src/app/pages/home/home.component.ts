import { Component, OnInit } from '@angular/core'
import { UserService } from 'src/app/user.service'

declare var SockJS

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private user: UserService) {}
  sock = null

  ngOnInit() {
    console.log('Opening socket...')
    this.sock = new SockJS('http://localhost:4444/sock')
    this.sock.onopen = () => {
      console.log('Socket opened')
      this.sock.send('hello')
    }
    this.sock.onmessage = (m) => {
      console.log('Received',m.data)
      this.sock.close()
    }
    this.sock.onclose = () => {
      console.log('Socket closed')
    }
  }
}
