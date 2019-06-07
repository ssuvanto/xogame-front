import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ctxt: CanvasRenderingContext2D


  ngOnInit() {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas')
    this.ctxt = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const lw = 30

    this.ctxt.strokeStyle = "black"

    for(let x=lw;x<=w;x+=lw){
      this.ctxt.moveTo(0.5 + x, 0)
      this.ctxt.lineTo(0.5 + x, h)
    }

    for(let y=lw;y<h;y+=lw){
      this.ctxt.moveTo(0, 0.5 + y)
      this.ctxt.lineTo(w, 0.5 + y)
    }

    this.ctxt.stroke()
  }
}
