import { Component, OnInit, OnDestroy } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute, ParamMap } from '@angular/router'

declare var SockJS

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ctxt: CanvasRenderingContext2D
  cw = 30 //cell width/height
  width: number
  game_width = 100
  game_height = 100
  cells: CellContent[][]
  cell_offset_x = 25
  cell_offset_y = 25
  line_color = '#888'
  box_color = '#555'

  sockopen = false
  sock = null
  messages = []


  canvClick(me: MouseEvent) {
    //console.log('Point:', me.offsetX, me.offsetY)
    const {x, y} = this.pixToScreenCell(me.offsetX, me.offsetY)
    this.cellClick(x, y)
  }

  cellClick(x: number, y: number){
    //console.log('Screen-space cell:', x, y)
    const gc = this.screenCellToGameCell(x, y)
    //console.log('Game-space cell:', gc.x, gc.y)
    if(this.getGameCell(gc.x, gc.y) === CellContent.Empty){
      this.setGameCell(gc.x, gc.y, CellContent.X)
    } else {
      this.setGameCell(gc.x, gc.y, CellContent.Empty)
    }
    this.sock.send(JSON.stringify({
      type: 'mark',
      data: {x: x, y: y}
    }))
    this.renderCells()
  }

  //Sets the game-space cell to the provided value
  setGameCell(x: number , y: number, val: CellContent){
    const ac = this.gameCellToArrayCell(x, y)
    //console.log('Array-space cell:', ac.x, ac.y)
    if(ac.x >= this.game_width || ac.x < 0 || ac.y >= this.game_height || ac.y < 0){
      console.log('setCell: attempting to play outside field')
      return
    }
    this.cells[ac.x][ac.y] = val
  }

  //Returns the game-space cell content at the provided x,y
  getGameCell(x: number, y: number): CellContent {
    const ac = this.gameCellToArrayCell(x, y)
    if(ac.x >= this.game_width || ac.x < 0 || ac.y >= this.game_height || ac.y < 0){
      console.log('getCell: attempting to get from outside field')
      return
    }
    return this.cells[ac.x][ac.y]
  }

  moveGrid(x: number, y: number){
    const num = Math.floor(this.width/this.cw)
    const w = Math.floor(this.game_width/2)
    const h = Math.floor(this.game_height/2)
    const lx = this.cell_offset_x + x
    const rx = lx + num
    const ty = this.cell_offset_y + y
    const by = ty + num
    if(lx < -w || rx > w || ty < -h || by > h){
      //console.log('cannot move further')
      return
    }
    this.cell_offset_x += x
    this.cell_offset_y += y
    this.renderCells()
  }

  //Returns the array-space cell based on game-space cell
  gameCellToArrayCell(x: number, y: number) {
    return {
      x: x + Math.floor( this.game_width  / 2 ),
      y: y + Math.floor( this.game_height / 2 )
    }
  }

  //Returns the game-space cell based on screen-space cell
  screenCellToGameCell(x: number, y: number) {
    return {x: x + this.cell_offset_x, y: y + this.cell_offset_y}
  }

  //Returns the screen-space cell based on pixel coordinates x,y
  pixToScreenCell(x: number, y: number) {
    const x_cell = Math.floor(x/this.cw)
    const y_cell = Math.floor(y/this.cw)
    return {x: x_cell ,y: y_cell}
  }

  //Returns the top left pixel coordinates of the screen-space cell at x,y
  screenCellToPix(x: number, y: number) {
    const x_pix = x  * this.cw
    const y_pix = y  * this.cw
    return {x: x_pix, y: y_pix}
  }

  renderCells() {
    //Screen-space width/height
    const num = Math.floor(this.width/this.cw)

    //Loop through screen-space cells
    for(let x=0;x<num;x++){
      for(let y=0;y<num;y++){
        const p = this.screenCellToPix(x, y)
        //Clear anything that might have already been there
        this.ctxt.clearRect(p.x + 5, p.y + 5, this.cw - 10, this.cw - 10)
        const gc = this.screenCellToGameCell(x, y)
        if(this.getGameCell(gc.x, gc.y) === CellContent.X){
          this.ctxt.fillStyle = this.box_color
          this.ctxt.fillRect(p.x + 5, p.y + 5, this.cw - 10, this.cw -10)
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
    this.initCanvas()
    /*this.cells = []
    for(let x=0;x<this.game_width;x++){
      this.cells[x] = []
      for(let y=0;y<this.game_height;y++){
        this.cells[x][y] = CellContent.Empty
      }
    }*/
    let id: string = null
    this.route.paramMap.subscribe((params: ParamMap) => {
      id = params.get('id')
    })
    this.http.get('http://localhost:4444/api/games/'+id).subscribe(res => {
      this.cells = res['state']
      this.renderCells()
    })

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



enum CellContent {
  Empty,
  X,
  O
}

