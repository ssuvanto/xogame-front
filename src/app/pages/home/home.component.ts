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
      this.sock.send(JSON.stringify({type: 'echo', data: msg}))
    }
  }

  sendMark(x, y){
    if(x && y){
      this.sock.send(JSON.stringify(
        {type: 'mark', data: {x: x, y: y}}
      ))
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
      m = JSON.parse(m.data)
      switch(m.type){
        case 'echo':
          this.messages.push(m.data)
          break
        case 'markok':
          this.messages.push('Mark ok at '+m.data.x+', '+m.data.y)
          break
        default:
          console.log('Message with unknown type')
      }
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
