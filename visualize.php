<!DOCTYPE html>
<html>
<head>
    <title>
        Seminar I
    </title>
    <link rel='stylesheet' href="bootstrap/css/bootstrap.min.css" />
    <link rel='stylesheet' href="css/custom_buttons.css" />
    <script src='bootstrap/js/bootstrap.min.js'></script>
    <link rel="icon" href='favicon.png'>
    <style>
      h3{
        text-align:center;text-decoration:underline;color:white;text-shadow:3px 3px 3px #303030;
        /* background:linear-gradient(to right, gold,silver);
        -webkit-background-clip: text;
	       -webkit-text-fill-color: transparent; */
      }
      hr{
        box-shadow:2px 2px 5px 5px #aaaaaa;
      }

      .hide{
        display:none;
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 30px;
        height: 17px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #2196F3;
        -webkit-transition: .4s;
        transition: .4s;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 12px;
        width: 12px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }

      input:checked + .slider {
        background-color: green;
      }

      input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
      }

      input:checked + .slider:before {
        -webkit-transform: translateX(12px);
        -ms-transform: translateX(12px);
        transform: translateX(12px);
      }

      /* Rounded sliders */
      .slider.round {
        border-radius: 17px;
      }

      .slider.round:before {
        border-radius: 50%;
      }
    </style>
</head>

<body style="background-color:black">
    <div style='padding:10px'>
      <div class='container-fluid' style="background-color:aliceblue;">
          <div style="padding:5px;background-image: linear-gradient(to right, #aaa , #333, #aaa, #333,#333, #aaa,#333, #aaa);box-shadow:4px 4px 4px #505050">
              <h3>Sudoku Solving With Constraint Propagation <h2>
          </div>
          <div>
            <hr>
            <label class="switch">
              <input type="checkbox" onchange='dothisRandomize(this)'>
              <span class="slider round"></span>
            </label>
            &nbsp;&nbsp;<span id='randomize-toggle' style='padding-right:10px;border-right:solid 1px black;border-top:solid 1px black'>RANDOMIZATION <b>Off</b></span>
            <label class="switch">
              <input type="checkbox" onchange='dothisRB(this)'>
              <span class="slider round"></span>
            </label>
            <a id=link style='display:none' target='_blank'></a>
            &nbsp;&nbsp;<span id='rb-interaction'  style='padding-right:10px;border-right:solid 1px black;border-bottom:solid 1px black'>HIDDEN SINGLES <b>Off</b></span>
            
            <div id='main-row' class='row' style='border-style:inset ;padding:10px;margin:2px;  box-shadow:10px 10px 5px black;'>
              <div id='col1' class='col-md-4' style='background-color:#555555;padding:5px'>
                <canvas style='border:3px solid black;padding:10px;box-shadow:3px 3px 4px 5px #a0a0a0' id='canvas-ui' width=600 height=500></canvas>
              </div>
              <div id='col2' class='col-md-8' style='display:none;background-color:#888;border:1px solid black'></div>
              <div id='col3' class='col-md-2' style='background-color:#666666;border-left:1px solid white; border-right:1px solid white;padding-top:5px;padding-bottom:5px;'>
                  <div class='butn hide' id='userInput'>validate Input</div>
                  <div class='butn' id='run_test'>run test</div>
                  <div class='butn' id='test'>use demo input</div>
                  <div id='demo-list' class='hide'>
                    <div class='butn' onclick='initializeDemo(1)'>Hard Puzzle</div>
                    <div class='butn' onclick='initializeDemo(9)'>Hardest</div>
                    <div class='butn' onclick='initializeDemo(10)'>Impossible</div>
                    <div class='butn' onclick='initializeDemo(8)'>Demo 1</div>
                    <div class='butn' onclick='initializeDemo(2)'>Demo 2</div>
                    <div class='butn' onclick='initializeDemo(3)'>Demo 3</div>
                    <div class='butn' onclick='initializeDemo(4)'>Demo 4</div>
                    <div class='butn' onclick='initializeDemo(5)'>Demo 5</div>
                    <div class='butn' onclick='initializeDemo(6)'>Demo 6</div>
                    <div class='butn' onclick='initializeDemo(7)'>Demo 7</div>
                  </div>
                  <div class='butn' id='clear'>Clear</div>
                  <div class='butn hide' id='solve'>Solve</div>
                  <div class='butn hide' id='trace'>Trace Solution Stack</div>
                    <!-- <button id="test" onclick=''>Use test sudoku</button><br><br>
                    <button id="solve" onclick='solve(); info();'>solve</button><br><br>
                    <button id="trace" style="display:none" onclick='DisplayTrace();'>Trace</button>
                    <div class="alert alert-info" style="display:none" id="info">We found a solution. Click on trace.</div> -->
              </div>
              <div id='col4' class='col-md-6' style='background-color:#888888;'>
                <p id='msg' style='display:none' class='alert alert-info'></p>
                <p id='error'  style='display:none' class='alert alert-danger'></p>
              </div>
            </div>
          </div>
              <br />
              <div style='float:left;width:50px;padding:50px'></div>

      </div>
    </div>
            <script src="scripts/js/getSudoku.js"></script>
            <script src="scripts/js/solver.js"></script>
            <script src="scripts/js/Sudoku_Canvas_UI.js"></script>
            <script src="scripts/js/run_tests.js"></script>

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
                    document.getElementById('test').addEventListener('click',function(){
                      document.getElementById('clear').click();
                      document.getElementById('demo-list').classList.remove('hide')
                      this.classList.add('hide')
                    });

                    function initializeDemo(demo){
                      sudoku_ui.initializeTestInputs(demo);
                      document.getElementById('solve').classList.remove('hide');
                      document.getElementById('userInput').classList.add('hide');
                      document.getElementById('demo-list').classList.add('hide')
                      document.getElementById('test').classList.remove('hide')
                      initializeConstraint();
                      constraint_after_initial_propagation = [... constraint];
                      // console.log(constraint_after_initial_propagation);
                      constraint = [[], [], [], [], [], [], [], [], []];
                    }

                    document.getElementById('clear').addEventListener('click',function() {
                      sudoku_ui.clearCurrentSudoku();                      
                      clearPreviousSolution()
                      document.getElementById('demo-list').classList.add('hide');
                      document.getElementById('test').classList.remove('hide');
                      document.getElementById('solve').classList.add('hide');
                      document.getElementById('userInput').classList.add('hide');
                      document.getElementById('trace').classList.add('hide');
                    });

                    document.getElementById('solve').addEventListener('click',function(){                      
                      var startDate = new Date(); 
                      if(solve()){
                        var endDate   = new Date();
                        var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                        document.getElementById('msg').innerHTML = "A Solution is found.<br>Total Steps to Solution: "+steps_counter+"<br>No.of backtracks: "+backtrack_counter+"<br>Time Taken: "+seconds+"s";
                        document.getElementById('msg').style.display = '';
                        document.getElementById('trace').classList.remove('hide');
                        document.getElementById('solve').classList.add('hide');
                        writeSolutionTraceToFile();
                      }
                      sudoku_ui.writeSolutionOnBoard();
                    });

                    document.getElementById('userInput').addEventListener('click',function(){
                          //do some tests first
                          if(!validateInput()){
                            document.getElementById('error').innerHTML = 'Input Sudoku is not complete!!!!';
                            document.getElementById('msg').innerHTML = 'The Input Should have 8 distinct digits and minimum 17 inputs for the sudoku to have unique solution.';
                            document.getElementById('error').style.display = document.getElementById('msg').style.display= '';
                          } else {
                            document.getElementById('msg').innerHTML = 'The Input is validated. You can now click on Solve to get a solution';
                            document.getElementById('msg').style.display= '';
                            document.getElementById('solve').classList.remove('hide');
                            document.getElementById('userInput').classList.add('hide');
                          }
                    });

                    document.getElementById('trace').addEventListener('click',function(){
                      solutionTraceAnimation();
                    });

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

                    function dothisRandomize(checkbox){
                      if(checkbox.checked){
                        random = true;
                        document.getElementById('randomize-toggle').innerHTML = 'RANDOMIZATION <b>On</b>';
                      } else {
                        random = false;
                        document.getElementById('randomize-toggle').innerHTML = 'RANDOMIZATION <b>Off</b>';
                      }
                      // console.log(random)
                    }

                    function dothisRB(checkbox){
                      if(checkbox.checked){
                        row_block_interaction = true;
                        document.getElementById('rb-interaction').innerHTML = 'HIDDEN SINGLES <b>On</b>';
                      } else {
                        row_block_interaction = false;
                        document.getElementById('rb-interaction').innerHTML = 'HIDDEN SINGLES <b>Off</b>';
                      }
                      // console.log(row_block_interaction)
                    }


                    function writeSolutionTraceToFile(){
                      console.log(complete_trace);
                      console.log(input_sudoku);
                      console.log(constraint_after_initial_propagation)
                    }
            </script>
</body>
</html>
