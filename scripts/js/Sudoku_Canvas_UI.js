//**********************************************//
//**********Sudoku_Canvas_UI.js*****************//
//**********************************************//

UI = function() {
    this.cns = null
    this.ctx = null
    this.default_size = 300
    this.board_size = 300 //default to 300
    this.initialized = false
    this.cell_size = Math.floor((this.board_size) / 9)

    this.I = 0
    this.J = 0
    this.clicked = false

    this.waitForInputAnimation_intervalFunction_ID = '';
    this.waitForInputAnimation_statusObject = '';
}


UI.prototype.Initialize = function (canvas_id) {
    this.cns = document.getElementById(canvas_id)

        console.log(canvas_id)
    if (!this.cns) {
        console.log('there is no canvas html element with given id '+canvas_id)
        this.initialized = false
        return
    }

    this.cns.width = this.board_size
    this.cns.height = this.board_size

    this.ctx = this.cns.getContext('2d')
    sudoku_ui = this

    //click even
    this.cns.addEventListener("click",function(evt){//this function is in global namespace
      coords = sudoku_ui.mouseClick(evt,sudoku_ui)
      if(coords.x<13 || coords.y<13 || coords.x>(sudoku_ui.board_size+9) || coords.y>(sudoku_ui.board_size+9)){
        sudoku_ui.clicked = false
        return
      }
      posJ = Math.abs(Math.floor((coords.y-13)/sudoku_ui.cell_size))
      posI = Math.abs(Math.floor((coords.x-13)/sudoku_ui.cell_size))
      sudoku_ui.I = posI
      sudoku_ui.J = posJ
      sudoku_ui.clicked = true

      sudoku_ui.ctx.fillStyle = '#727272'
      sudoku_ui.ctx.fillRect((sudoku_ui.I*sudoku_ui.cell_size)+3,(sudoku_ui.J*sudoku_ui.cell_size)+3,sudoku_ui.cell_size-5,sudoku_ui.cell_size-6)
      document.getElementById('msg').innerHTML = 'Waiting For Input.';
      document.getElementById('msg').style.display = 'block'

      console.log('click event inside sudoku , ',posI,posJ," co-ords: ",coords.y,coords.x)
      if(sudoku_grid[sudoku_ui.I][sudoku_ui.J]!=0){
        i = sudoku_ui.I * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) - Math.floor(sudoku_ui.cell_size/5)
        j = sudoku_ui.J * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) + Math.floor(sudoku_ui.cell_size/4)
        console.log('\n Inside putNumber: ',i,j)
        fontsize = Math.floor(sudoku_ui.cell_size/2)
        sudoku_ui.ctx.font = fontsize+"px Verdana";

        // Fill with gradient
        sudoku_ui.ctx.fillStyle = 'red';
        sudoku_ui.ctx.fillText(sudoku_grid[sudoku_ui.I][sudoku_ui.J], i+2, j);
      }
    });
    //---
    this.initialized = true
}

UI.prototype.dentedCells = function(){
  for(i=0;i<9;i++){
    for(j=0;j<9;j++){
        this.ctx.fillStyle = '#707070'
        this.ctx.fillRect((i*this.cell_size)+3,(j*sudoku_ui.cell_size)+3,this.cell_size-5,this.cell_size-6)
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect((i*this.cell_size)+4,(j*sudoku_ui.cell_size)+4,this.cell_size-5,this.cell_size-6)
    }
  }
}

UI.prototype.useDefaultBoardSize = function () {z
    this.board_size = this.default_size
}

UI.prototype.changeSizeOfBoard = function (size) {
    if(size>=this.default_size)
      this.board_size = size

    this.cell_size = Math.floor((this.board_size) / 9)
}

UI.prototype.mouseClick = function(evt,sudoku_ui){//mouseClick is in global namespace, so use of "this" will refer to global object
  document.getElementById('error').innerHTML = '';
   var rect = sudoku_ui.cns.getBoundingClientRect();
   return {
     x: evt.clientX - rect.left,
     y: evt.clientY - rect.top
   }
}

UI.prototype.putNumber = function(k){
  status = 'success'
  if(k!=''){
    updateSudoku_grid(this.I,this.J,k)
    status = inputSudokuValidator(this.I,this.J,k)
    console.log(status)
  }else {
    updateSudoku_grid(this.I,this.J,0)
  }
  if(status!=='success'){
    updateSudoku_grid(this.I,this.J,0)
    document.getElementById('error').innerHTML = status;
    document.getElementById('msg').innerHTML = '';
    document.getElementById('error').style.display = 'block';
    document.getElementById('msg').style.display = 'none';
    udoku_ui.ctx.fillStyle = 'white'
    sudoku_ui.ctx.fillRect((sudoku_ui.I*sudoku_ui.cell_size)+4,(sudoku_ui.J*sudoku_ui.cell_size)+4,sudoku_ui.cell_size-5,sudoku_ui.cell_size-6)
    return
  }
  document.getElementById('error').style.display = 'none';
  document.getElementById('error').innerHTML = '';
  this.clicked = false //
  this.ctx.save()
  this.ctx.fillStyle = 'gold'
  this.ctx.fillRect((this.I*this.cell_size)+4,(this.J*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
  i = this.I * this.cell_size + Math.floor(this.cell_size/2) - Math.floor(this.cell_size/5)
  j = this.J * this.cell_size + Math.floor(this.cell_size/2) + Math.floor(this.cell_size/4)
  console.log('\n Inside putNumber: ',i,j)
  fontsize = Math.floor(this.cell_size/2)
  this.ctx.font = fontsize+"px Verdana";

  // Fill with gradient
  this.ctx.fillStyle = 'green';
  this.ctx.fillText(k, i+2, j);
  this.ctx.restore()
  if(k!='') document.getElementById('msg').innerHTML = 'Number '+k+' is placed on cell['+(this.I+1)+","+(this.J+1)+"]";
  else document.getElementById('msg').innerHTML = 'Numbers only';
}

UI.prototype.drawSudokuBoard = function () {
    if (!this.initialized) return
    console.log('inside drawSudokuBoard')
    this.ctx.fillStyle = 'white';
    this.ctx.lineWidth = "2";
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0,this.board_size)
    this.ctx.fillRect(0, 0, this.board_size, this.board_size);
    this.ctx.stroke()
    this.ctx.save()
    this.ctx.strokeStyle = "#c5c5c0";
    this.ctx.beginPath();

    var cell_size = Math.floor((this.board_size) / 9)
    console.log(cell_size)
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            this.ctx.rect(0 + j * cell_size, 0 + i * cell_size, cell_size, cell_size);
        }
    }
    this.ctx.stroke()
    this.ctx.save
    this.ctx.strokeStyle = "#555";
    this.ctx.beginPath();

    cell_size = cell_size*3
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            this.ctx.rect(0 +  j * cell_size, 0 + i * cell_size, cell_size, cell_size);
        }
    }
    this.ctx.stroke()

    this.fillStyle = 'black'
    this.ctx.lineWidth ='3'
    this.ctx.beginPath();
    this.ctx.moveTo(2, 0);
    this.ctx.lineTo(2, this.board_size)
    this.ctx.lineTo(this.board_size, this.board_size)
    this.ctx.lineTo(this.board_size, 2)
    this.ctx.lineTo(2, 2)
    this.ctx.stroke();

    this.dentedCells();
}

UI.prototype.initializeTestInputs = function(){
    useDemoInput();
    for(i=0;i<9;i++){
      for(j=0;j<9;j++){
        if(sudoku_grid[i][j]){
          this.ctx.fillStyle = 'gold'
          this.ctx.fillRect((i*this.cell_size)+4,(j*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
          pi = i * this.cell_size + Math.floor(this.cell_size/2) - Math.floor(this.cell_size/5)
          pj = j * this.cell_size + Math.floor(this.cell_size/2) + Math.floor(this.cell_size/4)
          fontsize = Math.floor(this.cell_size/2)
          this.ctx.font = fontsize+"px Verdana";

          // Fill with gradient
          this.ctx.fillStyle = 'green';
          this.ctx.fillText(sudoku_grid[i][j], pi+2, pj);
        }
      }
    }
}

//-----------------GLOBAL functions below----------------

function windowKeyEventHandler(evt){
  keyCode = evt.keyCode
  keyValue = keyCodeToValue(keyCode)
  if(sudoku_ui.clicked) sudoku_ui.putNumber(keyValue) // if the sudoku board was clicked pass the keyboard event to sudoku_ui
}

function keyCodeToValue(code){
  switch (code) {
    case 48:
      return ''

    case 49:
      return 1

    case 50:
      return 2

    case 51:
      return 3

    case 52:
      return 4

    case 53:
      return 5

    case 54:
      return 6

    case 55:
      return 7

    case 56:
      return 8

    case 57:
      return 9

    default:
      return ''

  }
}

sudoku_ui = new UI()

window.addEventListener("keypress", windowKeyEventHandler)
document.getElementsByTagName('body')[0].addEventListener("click",function(){

    document.getElementById('msg').style.display = 'none'
    document.getElementById('error').style.display = 'none'
    sudoku_ui.clicked = false //
    sudoku_ui.ctx.fillStyle = 'white'
    if(!sudoku_grid[sudoku_ui.I][sudoku_ui.J]){
      sudoku_ui.ctx.fillStyle = 'white'
      sudoku_ui.ctx.fillRect((sudoku_ui.I*sudoku_ui.cell_size)+4,(sudoku_ui.J*sudoku_ui.cell_size)+4,sudoku_ui.cell_size-5,sudoku_ui.cell_size-6)
      document.getElementById('msg').innerHTML = '';
    } else {
      sudoku_ui.putNumber(sudoku_grid[sudoku_ui.I][sudoku_ui.J]);
    }
  },true);

console.log(test)
// test.changeSizeOfBoard(100)
id = "canvas-ui"
document.getElementById(id).style.background = 'radial-gradient(#000000, #ffffff)'
sudoku_ui.Initialize(id)
sudoku_ui.drawSudokuBoard()
