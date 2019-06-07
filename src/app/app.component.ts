import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ctxt: CanvasRenderingContext2D
  cw = 30 //cell width/height
  width: number
  game_width: 100
  game_height: 100
  cells: CellContent[][]
  cell_offset_x = -4
  cell_offset_y = 6
  line_color = '#888'
  box_color = '#555'

  canvClick(me: MouseEvent) {
    console.log('Point:', me.offsetX, me.offsetY)
    const {x, y} = this.canvToCell(me.offsetX, me.offsetY)
    this.cellClick(x, y)
  }

  cellClick(x: number, y: number){
    console.log('Cell:', x, y)
    //add to cells
  }

  setCell(x: number , y: number, val: CellContent){
    const arrayX = x + Math.floor(this.game_width/2)
    const arrayY = y + Math.floor(this.game_height/2)
    if(arrayX >= this.game_width || arrayX < 0 || arrayY >= this.game_height || arrayY < 0){
      console.error('setCell: attempting to play outside field')
      return
    }
    this.cells[x][y] = val
  }

  getCell(x: number, y: number): CellContent {
    const arrayX = x + Math.floor(this.game_width/2)
    const arrayY = y + Math.floor(this.game_height/2)
    if(arrayX >= this.game_width || arrayX < 0 || arrayY >= this.game_height || arrayY < 0){
      console.error('setCell: attempting to play outside field')
      return
    }
    return this.cells[x][y]
  }

  moveGrid(x: number, y: number){
    this.cell_offset_x += x
    this.cell_offset_y += y
  }

  //Returns the cell based on pixel coordinates x,y
  canvToCell(x: number, y: number) {
    const x_cell = Math.floor(x/this.cw) + this.cell_offset_x
    const y_cell = Math.floor(y/this.cw) + this.cell_offset_y
    return {x: x_cell ,y: y_cell}
  }

  //Returns the top left pixel coordinates of the cell at x,y
  cellToCanv(x: number, y: number) {
    const x_pix = (x - this.cell_offset_x) * this.cw
    const y_pix = (y - this.cell_offset_y) * this.cw
    return {x: x_pix, y: y_pix}
  }

  renderCells() {
    const num = Math.floor(this.width/this.cw)
    const subCells = []
    for(let x=0;x<num;x++){
      subCells[x] = []
      for(let y=0;y<num;y++){
        if(this.cells[this.cell_offset_x + x][this.cell_offset_y + y] === CellContent.X){
          const {x: px, y: py} = this.cellToCanv(x, y)
          this.ctxt.fillStyle = this.box_color
          this.ctxt.fillRect(px + 5, py + 5, this.cw - 10, this.cw -10)
        }
      }
    }
  }

  initCanvas() {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas')
    this.ctxt = canvas.getContext('2d')
    const w = canvas.width
    this.width = w
    const h = canvas.height

    this.ctxt.strokeStyle = this.line_color

    for(let x=this.cw;x<=w;x+=this.cw){
      this.ctxt.moveTo(0.5 + x, 0)
      this.ctxt.lineTo(0.5 + x, h)
    }

    for(let y=this.cw;y<h;y+=this.cw){
      this.ctxt.moveTo(0, 0.5 + y)
      this.ctxt.lineTo(w, 0.5 + y)
    }

    this.ctxt.stroke()
  }

  ngOnInit() {
    this.initCanvas()
    this.cells = []
    for(let x=0;x<this.game_width;x++){
      this.cells[x] = []
      for(let y=0;y<this.game_height;y++){
        this.cells[x][y] = CellContent.Empty
      }
    }
  }
}

enum CellContent {
  Empty,
  X,
  O
}
