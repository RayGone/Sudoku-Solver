<!DOCTYPE html>
<html>
  <head>
    <title>
      Seminar I
    </title>
    <link rel='stylesheet' href="bootstrap/css/bootstrap.min.css" />
    <script src='bootstrap/js/bootstrap.min.js'></script>

    <style>
      .box{
        padding:5px;
        margin:auto;
        text-align: center;
        text-shadow: 2px 5px 5px black;
        border:1px solid #55D234;
        height: 40px;
        width: 40px;

      }

      /* .box:hover{
      text-shadow: 2px 2px 2px green;
        border-radius: 20px;
        background-color: #9AFD8F
        ;
      } */

      .btop{
        padding:5px;
        margin:auto;
        text-align: center;
        border:0px solid black;
        height: 40px;
        width: 40px;
      }
    </style>
  </head>

  <body>
    <div class='container-fluid'>
      <div style="padding:5px;background-color:#aaa">
        <h3 style="text-align:center;text-decoration:underline">Sudoku solving with Constraint Propagation <h2>
      </div>
      <div class='row'><hr></div>
      <div>
          <div class='row'><div class='col-sm-12'><p id='error'></p></div></div>
          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left;'></div>
                  <div class='btop' style='float:left;'>1</div>
                  <div class='btop' style='float:left;'>2</div>
                  <div class='btop' style='float:left;'>3</div>
                  <div class='btop' style='float:left;'>4</div>
                  <div class='btop' style='float:left;'>5</div>
                  <div class='btop' style='float:left;'>6</div>
                  <div class='btop' style='float:left;'>7</div>
                  <div class='btop' style='float:left;'>8</div>
                  <div class='btop' style='float:left;'>9</div>
              </div>

              <div class='col-sm-3'>
                  <div><a href="#"></a></div>
              </div>
          </div>

          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left'>A</div>
                  <div class='box' id='A1' style='float:left;border-color:black;border-top:2px;border-left:2px;border-style:solid;'></div>
                  <div class='box' id='A2' style='float:left;border-color:black;border-top:2px;border-style:solid;'></div>
                  <div class='box' id='A3' style='float:left;border-color:black;border-top:2px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='A4' style='float:left;border-color:black;border-top:2px;border-left:1px;border-style:solid;'></div>
                  <div class='box' id='A5' style='float:left;border-color:black;border-top:2px;border-style:solid;'></div>
                  <div class='box' id='A6' style='float:left;border-color:black;border-top:2px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='A7' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='A8' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='A9' style='float:left;border-color:black;border-top:2px;border-right:2px;border-style:solid;'></div>
              </div>

              <div class='col-sm-3'></div>
          </div>

          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left;'>B</div>
                  <div class='box' id='B1' style='float:left;border-color:black;border-top:1px;border-left:2px;border-style:solid;'></div>
                  <div class='box' id='B2' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='B3' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='B4' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='B5' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='B6' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='B7' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='B8' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='B9' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
              </div>

              <div class='col-sm-3'></div>
          </div>

          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left;'>C</div>
                  <div class='box' id='C1' style='float:left;border-color:black;border-top:1px;border-left:2px;border-style:solid;'></div>
                  <div class='box' id='C2' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='C3' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='C4' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='C5' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='C6' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='C7' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='C8' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='C9' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
              </div>

              <div class='col-sm-3'></div>
          </div>

          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left;'>D</div>
                  <div class='box' id='D1' style='float:left;border-color:black;border-top:2px;border-left:2px;border-style:solid;'></div>
                  <div class='box' id='D2' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='D3' style='float:left;border-color:black;border-top:2px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='D4' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='D5' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='D6' style='float:left;border-color:black;border-top:2px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='D7' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='D8' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='D9' style='float:left;border-color:black;border-top:2px;border-right:2px;border-style:solid;'></div>
              </div>

              <div class='col-sm-3'></div>
          </div>

          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left;'>E</div>
                  <div class='box' id='E1' style='float:left;border-color:black;border-top:1px;border-left:2px;border-style:solid;'></div>
                  <div class='box' id='E2' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='E3' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='E4' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='E5' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='E6' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='E7' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='E8' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='E9' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
              </div>

              <div class='col-sm-3'></div>
          </div>

          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left;'>F</div>
                  <div class='box' id='F1' style='float:left;border-color:black;border-top:1px;border-left:2px;border-style:solid;'></div>
                  <div class='box' id='F2' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='F3' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='F4' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='F5' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='F6' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='F7' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='F8' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='F9' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
              </div>

              <div class='col-sm-3'></div>
          </div>

          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left;'>G</div>
                  <div class='box' id='G1' style='float:left;border-color:black;border-top:2px;border-left:2px;border-style:solid;'></div>
                  <div class='box' id='G2' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='G3' style='float:left;border-color:black;border-top:2px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='G4' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='G5' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='G6' style='float:left;border-color:black;border-top:2px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='G7' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='G8' style='float:left;border-color:black;border-top:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='G9' style='float:left;border-color:black;border-top:2px;border-right:2px;border-style:solid;'></div>
              </div>

              <div class='col-sm-3'></div>
          </div>

          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left;'>H</div>
                  <div class='box' id='H1' style='float:left;border-color:black;border-top:1px;border-left:2px;border-style:solid;'></div>
                  <div class='box' id='H2' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='H3' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='H4' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='H5' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='H6' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='H7' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='H8' style='float:left;border-color:black;border-top:1px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='H9' style='float:left;border-color:black;border-top:1px;border-right:2px;border-style:solid;'></div>
              </div>

              <div class='col-sm-3'></div>
          </div>

          <div class='row'>
              <div class='col-sm-4'></div>

              <div class='col-sm-5'>
                  <div class='btop' style='float:left;'>I</div>
                  <div class='box' id='I1' style='float:left;border-color:black;border-bottom:2px;border-left:2px;border-style:solid;'></div>
                  <div class='box' id='I2' style='float:left;border-color:black;border-bottom:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='I3' style='float:left;border-color:black;border-bottom:2px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='I4' style='float:left;border-color:black;border-bottom:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='I5' style='float:left;border-color:black;border-bottom:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='I6' style='float:left;border-color:black;border-bottom:2px;border-right:2px;border-style:solid;'></div>
                  <div class='box' id='I7' style='float:left;border-color:black;border-bottom:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='I8' style='float:left;border-color:black;border-bottom:2px;border-right:1px;border-style:solid;'></div>
                  <div class='box' id='I9' style='float:left;border-color:black;border-bottom:2px;border-right:2px;border-style:solid;'></div>
              </div>

              <div class='col-sm-3'></div>
          </div>

          <br />

          <div id='notice' style='display:none'>
              <div class='row'>
                  <div class='col-sm-4'></div>
                  <div class='col-sm-6'>
                      Insert a number in <span id="bid"></span> cell: <input id='input' onkeyup="callevent()" onblur="document.getElementById('notice').style.display='none';" type='number' min=1>
                  </div>
                  <div class='col-sm-3'>  </div>
              </div>
          </div>

          <button id="solve" onclick='solve(); info();'>solve</button>
          <button id="test" onclick='useTestInput();document.getElementById("clear").style.display="block";'>Use test sudoku</button>
          <button id="trace" style="display:none" onclick='DisplayTrace();'>Trace</button>
          <div class="alert alert-info" style="display:none" id="info">We found a solution. Click on trace.</div>
          <button id="clear" style="display:none" onclick='clearSudoku();'>Clear</button>

          <script src="scripts/js/getSudoku.js"></script>
          <script src="scripts/js/solver.js"></script>

          <script>

              var selected = '';
              function putInput() {
                  console.log('i was called', "value is " + document.getElementById("input").value);
                  document.getElementById(selected).innerHTML = document.getElementById("input").value;
              }

              function callevent() {

                  document.getElementById('error').innerHTML = '';
                  document.getElementById("input").value = event.key;
                  console.log(event.key);
                  if (event.key == '0') {
                      document.getElementById(selected).innerHTML = '';
                      var pos = cellIdToArrayPos(selected);
                      var value = Number(document.getElementById(selected).innerHTML);
                      updateSudoku_grid(pos[0], pos[1], 0);//updateSudoku_grid function in solver.js
                  }
                  if (event.key.match(/[1-9]/g)) {
                      document.getElementById(selected).innerHTML = document.getElementById("input").value;
                      var pos = cellIdToArrayPos(selected);
                      var value = Number(document.getElementById(selected).innerHTML);
                      updateSudoku_grid(pos[0], pos[1], value);//updateSudoku_grid function in solver.js
                      var flag = inputSudokuValidator(pos[0], pos[1], value);
                      if (flag != 'success') {
                          document.getElementById(selected).innerHTML = '';
                          document.getElementById('error').innerHTML = flag;
                          updateSudoku_grid(pos[0], pos[1], 0);//updateSudoku_grid function in solver.js
                      }
                      console.log("result", flag);
                  }
                  inputSudokuComplete();
                  // console.log(sudoku_grid);//sudoku_grid valu in solver.js
              }

              var boxes = document.getElementsByClassName("box");
              for (var i = 0; i < boxes.length; i++) {
                  boxes[i].addEventListener("click", function () {
                      console.log("i was called", this.id);
                      // console.log(cellIdToArrayPos(this.id));
                      document.getElementById('notice').style.display = 'block';
                      document.getElementById('input').value = '';
                      document.getElementById('input').focus();
                      document.getElementById('bid').innerHTML = this.id;
                      selected = this.id;
                  });
              }

              function cellIdToArrayPos(id) {
                  var arr = id.split("");
                  switch (arr[0]) {
                      case 'A': arr[0] = 0; break;
                      case 'B': arr[0] = 1; break;
                      case 'C': arr[0] = 2; break;
                      case 'D': arr[0] = 3; break;
                      case 'E': arr[0] = 4; break;
                      case 'F': arr[0] = 5; break;
                      case 'G': arr[0] = 6; break;
                      case 'H': arr[0] = 7; break;
                      case 'I': arr[0] = 8; break;
                      default: break;
                  }
                  arr[1] = arr[1] - 1;
                  return arr;
              }
          </script>

          <script>

              function clearSudoku() {

                  clearInterval(trace_id);
                  document.getElementById('trace').style.display = 'none'
                  document.getElementById('clear').style.display = 'none'

                  document.getElementById('info').style.display = 'none';
                  clearPreviousSolution()
                  for (i = 0; i < 9; i++) {
                      for (j = 0; j < 9; j++) {
                          var pos = arrayPosToHTMLid(i, j);
                          var id = document.getElementById(pos);
                          id.innerHTML = '';
                          id.style.background = ''
                      }
                  }
              }
              //solve();
              function useTestInput() {
                  useDemoInput();
                  for (i = 0; i < 9; i++) {
                      for (j = 0; j < 9; j++) {
                          if (sudoku_grid[i][j] !== 0) {
                              var pos = arrayPosToHTMLid(i, j)
                              var value = sudoku_grid[i][j]
                              document.getElementById(pos).innerHTML = value;
                              document.getElementById(pos).style.background = '#C0C0C0'
                          }
                      }
                  }
              }

              var trace_counter = 0;
              var trace_id = '';
              function DisplayTrace() {
                  trace_counter = 0;
                  trace_id = setInterval(function () {
                      if (trace_counter < complete_trace['choice_trace'].length) {
                          var step = complete_trace['choice_trace'][trace_counter];
                          var pos = arrayPosToHTMLid(step['pos'][0], step['pos'][1])
                          var value = step['value']
                          var id = document.getElementById(pos)
                          if (step['propagation'] === 'forward') {
                              id.innerHTML = value
                              id.style.background = '#55D234'
                          } else {
                              id.style.background = '#D25534'
                              id.innerHTML = '';
                          }
                      }
                      else {
                          clearInterval(trace_id);
                          console.log('DisplayTrace exited')
                      }
                      trace_counter++;
                  },
                      200);
              }

              function info() {
                  document.getElementById("trace").style.display = "block";
                  document.getElementById('info').style.display = 'block';
              }
          </script>
</body>
</html>
