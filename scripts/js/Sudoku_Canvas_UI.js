  //***************************************************//
 //***************Sudoku_Canvas_UI.js*****************//
//***************************************************//

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

    this.cell_with_number_clicked = false;
    this.cell_with_number_I = 0;
    this.cell_with_number_J = 0;
}


UI.prototype.Initialize = function (canvas_id) {
    this.cns = document.getElementById(canvas_id)

    // console.log(canvas_id)
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
      if(test_input){
        document.getElementById('msg').innerHTML = 'Can\'t Accept Input While Demo Input Selected.<br> If you want to insert input, click on clear button.';
        document.getElementById('msg').style.display = 'block'
        return
      }
      coords = sudoku_ui.mouseClick(evt,sudoku_ui)
      if(coords.x<13 || coords.y<13 || coords.x>(sudoku_ui.board_size+9) || coords.y>(sudoku_ui.board_size+9)){
        sudoku_ui.clicked = false
        return
      }
      posJ = Math.abs(Math.floor((coords.y-13)/sudoku_ui.cell_size))
      posI = Math.abs(Math.floor((coords.x-13)/sudoku_ui.cell_size))
      sudoku_ui.I = posJ
      sudoku_ui.J = posI
      sudoku_ui.clicked = true

      var grd = sudoku_ui.ctx.createLinearGradient(0, 0, 50, 0);
      grd.addColorStop(0, "#008800");
      grd.addColorStop(1, "#00ff00");

      sudoku_ui.ctx.fillStyle = grd
      // sudoku_ui.I corresponds to Y co-ordinate and sudoku_ui.J to X co-ordinate
      sudoku_ui.ctx.fillRect((sudoku_ui.J*sudoku_ui.cell_size)+4,(sudoku_ui.I*sudoku_ui.cell_size)+4,sudoku_ui.cell_size-6,sudoku_ui.cell_size-7)
      document.getElementById('msg').innerHTML = 'Waiting For Input.';
      document.getElementById('msg').style.display = 'block'
      document.getElementById('userInput').classList.remove('hide');
      console.log('click event inside sudoku , ',sudoku_ui.I,sudoku_ui.J," co-ords: ",coords.x,coords.y)

      if(sudoku_grid[sudoku_ui.I][sudoku_ui.J]!=0){
        X = sudoku_ui.J * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) - Math.floor(sudoku_ui.cell_size/5)
        Y = sudoku_ui.I * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) + Math.floor(sudoku_ui.cell_size/4)
        fontsize = Math.floor(sudoku_ui.cell_size/2)
        sudoku_ui.ctx.font = fontsize+"px Verdana";

        // Fill with gradient
        sudoku_ui.ctx.fillStyle = 'red';
        sudoku_ui.ctx.fillText(sudoku_grid[sudoku_ui.I][sudoku_ui.J], X+2, Y);

        sudoku_ui.cell_with_number_clicked = true;
        sudoku_ui.cell_with_number_I = sudoku_ui.I
        sudoku_ui.cell_with_number_J = sudoku_ui.J
      }
    });
    //---
    this.initialized = true
}

UI.prototype.dentedCells = function(){
  for(i=0;i<9;i++){
    for(j=0;j<9;j++){
        this.ctx.fillStyle = '#303030'
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
  if(!this.clicked)   return
  this.cell_with_number_clicked = false;

  console.log(k)
  zero = false
  if(k===0){
    zero = true
    k=''
  }
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
    this.ctx.fillStyle = 'red'
    this.ctx.fillRect((this.J*this.cell_size)+4,(this.I*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
    return
  }
  document.getElementById('error').style.display = 'none';
  document.getElementById('error').innerHTML = '';
  this.clicked = false //
  this.ctx.save()
  if(!zero){
    if(k)this.ctx.fillStyle = 'gold'
    else this.ctx.fillStyle = 'red'
  } else {
    console.log(zero)
    this.ctx.fillStyle = 'white'
    document.getElementById('msg').innerHTML = 'Input is cleared on the selected cell.'
  }
  this.ctx.fillRect((this.J*this.cell_size)+4,(this.I*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
  X = this.J * this.cell_size + Math.floor(this.cell_size/2) - Math.floor(this.cell_size/5)
  Y = this.I * this.cell_size + Math.floor(this.cell_size/2) + Math.floor(this.cell_size/4)
  console.log('\n Inside putNumber: ',X,Y)
  fontsize = Math.floor(this.cell_size/2)
  this.ctx.font = fontsize+"px Verdana";

  // Fill with gradient
  this.ctx.fillStyle = 'green';
  this.ctx.fillText(k, X+2, Y);
  this.ctx.restore()
  if(k!='') document.getElementById('msg').innerHTML = 'Number '+k+' is placed on cell['+(this.I+1)+","+(this.J+1)+"]";
  else{ if(!zero)document.getElementById('msg').innerHTML = 'Please Press Number Keys only!!<br> Inserting non-digit key clears input in selected cell.'; }
}

UI.prototype.drawSudokuBoard = function () {
    if (!this.initialized) return
    // console.log('inside drawSudokuBoard')
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
    // console.log(cell_size)
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

UI.prototype.initializeTestInputs = function(number){
    document.getElementById('msg').style.display = 'block'
    document.getElementById('msg').innerHTML = 'Demo '+number+' Input Is Loaded.<br> Now click on solve to get a solution.'

    useDemoInput(number);
    this.writeInputOnBoard(sudoku_grid);

}

UI.prototype.writeInputOnBoard = function(sudoku){
  for(i=0;i<9;i++){
    for(j=0;j<9;j++){
      if(sudoku[i][j]){
        this.ctx.fillStyle = 'gold'
        this.ctx.fillRect((j*this.cell_size)+4,(i*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
        pi = j * this.cell_size + Math.floor(this.cell_size/2) - Math.floor(this.cell_size/5)
        pj = i * this.cell_size + Math.floor(this.cell_size/2) + Math.floor(this.cell_size/4)
        fontsize = Math.floor(this.cell_size/2)
        this.ctx.font = fontsize+"px Verdana";

        // Fill with gradient
        this.ctx.fillStyle = 'green';
        this.ctx.fillText(sudoku[i][j], pi+2, pj);
      } else {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect((j*this.cell_size)+4,(i*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
      }
    }
  }
}

UI.prototype.writeSolutionOnBoard = function(){
  for(i=0;i<9;i++){
    for(j=0;j<9;j++){
      if(sudoku_grid[i][j]){
        var len = constraint[i][j].length;
        if(constraint[i][j][len-1] === 10){
          this.ctx.fillStyle = 'gold'
          this.ctx.fillRect((j*this.cell_size)+4,(i*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
          pi = j * this.cell_size + Math.floor(this.cell_size/2) - Math.floor(this.cell_size/5)
          pj = i * this.cell_size + Math.floor(this.cell_size/2) + Math.floor(this.cell_size/4)
          fontsize = Math.floor(this.cell_size/2)
          this.ctx.font = fontsize+"px Verdana";

          // Fill with gradient
          this.ctx.fillStyle = 'green';
          this.ctx.fillText(sudoku_grid[i][j], pi+2, pj);
        } else {
          this.ctx.fillStyle = '#3399CC'
          this.ctx.fillRect((j*this.cell_size)+4,(i*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
          pi = j * this.cell_size + Math.floor(this.cell_size/2) - Math.floor(this.cell_size/5)
          pj = i * this.cell_size + Math.floor(this.cell_size/2) + Math.floor(this.cell_size/4)
          fontsize = Math.floor(this.cell_size/2)
          this.ctx.font = fontsize+"px Verdana";

          // Fill with gradient
          this.ctx.fillStyle = '#FFFF00';
          this.ctx.fillText(sudoku_grid[i][j], pi+2, pj);
        }
      } else {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect((j*this.cell_size)+4,(i*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
      }
    }
  }
}


UI.prototype.clearCurrentSudoku = function(){
      clearPreviousSolution()
      for(i=0;i<9;i++){
        for(j=0;j<9;j++){
          this.ctx.fillStyle = 'white'
          this.ctx.fillRect((j*this.cell_size)+4,(i*this.cell_size)+4,this.cell_size-6,this.cell_size-7)
        }
      }
}

//-----------------GLOBAL functions below----------------

solutionTraceAnimation_interval_id = '';
solutionTraceAnimation_counter = 0;
solutionTraceBackward_trace_array = [];
backpropagationCounter = 1;


solutionTraceAnimation = function(){
  solutionTraceAnimation_counter = 0;
  solutionTraceAnimation_interval_id = setInterval(solutionTraceForward,200);

}

solutionTraceForward = function(){
  if(solutionTraceAnimation_counter < complete_trace['choice_trace'].length){
        var status = complete_trace['choice_trace'][solutionTraceAnimation_counter]
        var pos  = status['pos']
        var value = status['value']
        if (status['propagation'] === 'forward') {
          //code here
          sudoku_ui.ctx.fillStyle = '#1aff1a'
          sudoku_ui.ctx.fillRect((pos[1]*sudoku_ui.cell_size)+4,(pos[0]*sudoku_ui.cell_size)+4,sudoku_ui.cell_size-6,sudoku_ui.cell_size-7)
          i = pos[1] * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) - Math.floor(sudoku_ui.cell_size/5)
          j = pos[0] * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) + Math.floor(sudoku_ui.cell_size/4)
          fontsize = Math.floor(sudoku_ui.cell_size/2)
          sudoku_ui.ctx.font = fontsize+"px Verdana";
          // Fill with gradient
          sudoku_ui.ctx.fillStyle = 'black';
          sudoku_ui.ctx.fillText(value, i+2, j);
        } else { //if propagation is backward
          clearInterval(solutionTraceAnimation_interval_id);
          interval = 200;
          if(steps_counter>100) interval = 50;
          solutionTraceAnimation_interval_id = setInterval(solutionTraceBackward,interval);
          return;
        }
  }
  else {
      clearInterval(solutionTraceAnimation_interval_id);
      console.log('DisplayTrace exited')
  }
  solutionTraceAnimation_counter++;
}

solutionTraceBackward = function(){
  if(solutionTraceAnimation_counter < complete_trace['choice_trace'].length){
    var status = complete_trace['choice_trace'][solutionTraceAnimation_counter]
    var pos  = status['pos']
    var value = status['value']
    if (status['propagation'] === 'backward') {
      solutionTraceBackward_trace_array.push(pos);
      //code here
      sudoku_ui.ctx.fillStyle = '#b30000'
      sudoku_ui.ctx.fillRect((pos[1]*sudoku_ui.cell_size)+4,(pos[0]*sudoku_ui.cell_size)+4,sudoku_ui.cell_size-6,sudoku_ui.cell_size-7)
      i = pos[1] * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) - Math.floor(sudoku_ui.cell_size/5)
      j = pos[0] * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) + Math.floor(sudoku_ui.cell_size/4)
      fontsize = Math.floor(sudoku_ui.cell_size/2)
      sudoku_ui.ctx.font = (fontsize/2)+"px Verdana";
      // Fill with gradient
      sudoku_ui.ctx.fillStyle = 'white';
      sudoku_ui.ctx.fillText('bc'+backpropagationCounter++, i, j-5);
    } else { //if propagation is forward
      backpropagationCounter = 1;
      clearInterval(solutionTraceAnimation_interval_id);
      solutionTraceAnimation_interval_id = setInterval(function(){
          if(solutionTraceBackward_trace_array.length>0){
            pos = solutionTraceBackward_trace_array.pop();
            //code here
            sudoku_ui.ctx.fillStyle = 'white'
            sudoku_ui.ctx.fillRect((pos[1]*sudoku_ui.cell_size)+4,(pos[0]*sudoku_ui.cell_size)+4,sudoku_ui.cell_size-6,sudoku_ui.cell_size-7)
            i = pos[1] * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) - Math.floor(sudoku_ui.cell_size/5)
            j = pos[0] * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) + Math.floor(sudoku_ui.cell_size/4)
            fontsize = Math.floor(sudoku_ui.cell_size/2)
          } else {
              clearInterval(solutionTraceAnimation_interval_id);
              //------
              solutionTraceAnimation_interval_id = setInterval(solutionTraceForward,200);
          }
      },100);
      return;
    }
  }
  else {
      console.log('cleared')
      clearInterval(solutionTraceAnimation_interval_id);
      console.log('DisplayTrace exited')
  }
  solutionTraceAnimation_counter++;
}

function windowKeyEventHandler(evt){
  keyCode = evt.keyCode
  keyValue = keyCodeToValue(keyCode)
  if(sudoku_ui.clicked) sudoku_ui.putNumber(keyValue) // if the sudoku board was clicked pass the keyboard event to sudoku_ui
}

function keyCodeToValue(code){
  switch (code) {
    case 48:
      return 0

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

    if(sudoku_ui.cell_with_number_clicked){
      sudoku_ui.ctx.fillStyle = 'gold'
      // sudoku_ui.I corresponds to Y co-ordinate and sudoku_ui.J to X co-ordinate
      sudoku_ui.ctx.fillRect((sudoku_ui.cell_with_number_J*sudoku_ui.cell_size)+4,(sudoku_ui.cell_with_number_I*sudoku_ui.cell_size)+4,sudoku_ui.cell_size-6,sudoku_ui.cell_size-7)

      X = sudoku_ui.cell_with_number_J * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) - Math.floor(sudoku_ui.cell_size/5)
      Y = sudoku_ui.cell_with_number_I * sudoku_ui.cell_size + Math.floor(sudoku_ui.cell_size/2) + Math.floor(sudoku_ui.cell_size/4)
      fontsize = Math.floor(sudoku_ui.cell_size/2)
      sudoku_ui.ctx.font = fontsize+"px Verdana";

      sudoku_ui.ctx.fillStyle = 'green';
      sudoku_ui.ctx.fillText(sudoku_grid[sudoku_ui.cell_with_number_I][sudoku_ui.cell_with_number_J], X+2, Y);
      sudoku_ui.cell_with_number_clicked = false;
    }

    if(!sudoku_grid[sudoku_ui.I][sudoku_ui.J]){
      sudoku_ui.ctx.fillStyle = 'white'
      sudoku_ui.ctx.fillRect((sudoku_ui.J*sudoku_ui.cell_size)+4,(sudoku_ui.I*sudoku_ui.cell_size)+4,sudoku_ui.cell_size-5,sudoku_ui.cell_size-6)
      document.getElementById('msg').innerHTML = '';
    } else {
      sudoku_ui.putNumber(sudoku_grid[sudoku_ui.I][sudoku_ui.J]);
    }
  },true);

// test.changeSizeOfBoard(100)
id = "canvas-ui"
document.getElementById(id).style.background = 'radial-gradient(#000000, #ffffff)'
sudoku_ui.Initialize(id)
sudoku_ui.drawSudokuBoard()
