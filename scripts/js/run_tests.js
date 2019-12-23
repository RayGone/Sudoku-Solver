var sudoku_index = 94;//getNextSudoku uses this as incrementer
var steps_array = [];
var backtrack_array = [];
var time = [];
var show_on_board = false;

function getSudoku(index){
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "./getSudoku.php");
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      return JSON.parse(this.responseText);
    }
  };

  var formData = new FormData();
  formData.append('index', index);
  xhttp.send(formData);
}

function run_tests(){
  var xhttp = new XMLHttpRequest();
  index = sudoku_index;
  xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
       if(index == 0) console.log(this.responseText);
       sudoku_grid = JSON.parse(this.responseText);
       if(show_on_board){
          sudoku_ui.writeInputOnBoard(sudoku_grid);
          downloadCanvasImage('sudoku_input-'+sudoku_index+'.png');
       }
       test_input = true;
       
       var startDate = new Date();       
       solve();       
       var endDate   = new Date();
       var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
       time.push(seconds);
       console.log(seconds);
       steps_array.push(steps_counter);
       backtrack_array.push(backtrack_counter);

       if(show_on_board){
          sudoku_ui.writeSolutionOnBoard(sudoku_grid);
          downloadCanvasImage('sudoku_output-'+sudoku_index+'.png');
       }

       clearPreviousSolution();
       if(sudoku_index<95){
         run_tests();
       } else {
         console_result();
       }
     }
   };
   xhttp.open("POST", "./getSudoku.php");
   var formData = new FormData();
   console.log('sudoku_index',sudoku_index);
   formData.append('index', sudoku_index);
   xhttp.send(formData);
   sudoku_index++;
}

function console_result(){
  console.log('___STEPS:___')
  sum = 0;
  max = 0;
  min = steps_array[0];
  max_index = 0;
  min_index = 0;
  time_avg = 0;
  for(x in steps_array){
    time_avg += time[x];
    sum+=steps_array[x];
    if(steps_array[x]>max){
       max = steps_array[x];
       max_index = x;
    }
    if(steps_array[x]<min){
       min = steps_array[x];
       min_index = x;
    }
  }
  avg = sum/steps_array.length;
  time_avg = time_avg/time.length;
  console.log('max: ',max, "index: ",max_index,"time: ",time[max_index]);
  console.log('min: ',min,"index: ",min_index,"time: ",time[min_index]);
  console.log('AVERAGES\n---------\nSteps: ',avg,"time: ",time_avg);

  console.log('---------------------')
  console.log('___BACKTRACKS:___')
  // sum = 0;
  max = 0;
  min = backtrack_array[0];
  max_index = 0;
  min_index = 0;
  for(x in backtrack_array){
    // sum+=backtrack_array[x];
    if(backtrack_array[x]>max){
       max = backtrack_array[x];
       max_index = x;
    }
    if(backtrack_array[x]<min){
       min = backtrack_array[x];
       min_index = x;
    }
  }
  avg = sum/backtrack_array.length;
  console.log('max: ',max, "index: ",max_index);
  console.log('min: ',min,"index: ",min_index);
  // console.log('average: ',avg);
  console.log('*******************');
}

document.getElementById('run_test').addEventListener('click',function(){
  sudoku_index = 0;
  backtrack_array = [];
  steps_array = [];
  time = [];
  run_tests();
});

function downloadCanvasImage(name){
  var canvas=document.getElementById('canvas-ui')
  var link = document.getElementById('link');
  link.setAttribute('download', name);
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();
}
