import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ctxt: CanvasRenderingContext2D
  lw = 30

  canvClick(me: MouseEvent) {
    const x_cell = Math.floor(me.x/this.lw)
    const y_cell = Math.floor(me.y/this.lw)
    this.cellClick(x_cell, y_cell)
  }

  cellClick(x, y){
    console.log('Clicked at', x, y)
    this.ctxt.fillRect(x * this.lw + 5, y * this.lw + 5, this.lw - 10, this.lw -10)
  }

  initCanvas() {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas')
    this.ctxt = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height

    this.ctxt.strokeStyle = "black"

    for(let x=this.lw;x<=w;x+=this.lw){
      this.ctxt.moveTo(0.5 + x, 0)
      this.ctxt.lineTo(0.5 + x, h)
    }

    for(let y=this.lw;y<h;y+=this.lw){
      this.ctxt.moveTo(0, 0.5 + y)
      this.ctxt.lineTo(w, 0.5 + y)
    }

    this.ctxt.stroke()
  }

  ngOnInit() {
    this.initCanvas()
  }
}
