import { Component, OnInit, OnDestroy } from '@angular/core'
import { UserService } from 'src/app/user.service'

declare var SockJS

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private user: UserService) {}
  sockopen = false
  sock = null
  messages = []

  sendMsg(msg) {
    if(msg){
      this.sock.send(msg)
    }
  }

  ngOnInit() {
    console.log('Opening socket...')
    this.sock = new SockJS('http://localhost:4444/sock')
    this.sock.onopen = () => {
      console.log('Socket opened')
      this.sockopen = true
    }
    this.sock.onmessage = (m) => {
      console.log('Received',m.data)
      this.messages.push(m.data)
    }
    this.sock.onclose = () => {
      console.log('Socket closed')
    }
  }

  ngOnDestroy() {
    if(this.sockopen){
      this.sock.close()
    }
  }
}
