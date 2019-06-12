import { Component, OnInit, OnDestroy } from '@angular/core'
import { UserService } from 'src/app/user.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private user: UserService) {}

  ngOnInit() {
    
  }
}
