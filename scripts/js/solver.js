  /*--------------------------*/
 /*------solver.js-----------*/
/*--------------------------*/
var random = false;
var row_block_interaction = false;
var sudoku_grid = [];
var input_sudoku = []; //its is just a copy of sudoku_grid before solve() is called.
var constraint_after_initial_propagation = [];
//initializing sudoku_grid;
function initializeEmptyGrid() {
    for (var i = 0; i < 9; i++) {
        sudoku_grid.push([]);
        // //console.log(sudoku_grid);
        for (var j = 0; j < 9; j++) {
            sudoku_grid[i][j] = 0;
        }
    }
    delete i, j;
}
initializeEmptyGrid();
//end initializing

var row_unit = [[], [], [], [], [], [], [], [], []]; // groups cells as per column unit, there are 9 columns in 9*9 sudoku, 9*1
var col_unit = [[], [], [], [], [], [], [], [], []]; // groups cells as per row unit, there are 9 row units in 9*9 sudoku, 1*9
var box_unit = [[], [], [], [], [], [], [], [], []]; // groups cells as per box unit, each box unit is group of 3*3, there are 9 box unit in 9*9 sudoku
var peers = [[], [], [], [], [], [], [], [], []]; // contains peers, index to row_unit, col_unit and box_unit for each cell
var constraint = [[], [], [], [], [], [], [], [], []]; // stores possible choices left for any cell in sudoku
var visualize = false; //if set true displays sudoku during every changes made on console.
var debug = false;//displays working information of the program, while searching for solution,on the console. like where it is currently, where the change is made in sudoku
var test_input = false;
var user_input = false;

var choice_trace = []; // it is a stack that traces the choices made so far. Helps to backtrack
//form: choice_trace = [{'pos':[i,j],'value':value},......]
var propagation_trace = []; //corresponds to the choice_trace. keeps track of effect of choice on constraint of its peers
//form: propagation_trace = [[{'pos':[i,j],'value':value},......],........]
// here 'pos' is position of peers and doesn't match 'pos' in choice_trace but 'value' does correspond i.e. is equal

var complete_trace = { 'choice_trace': [], 'propagation_trace': [] }; //while choice_trace and propagation trace records only the moves that lead to solution (at the end),
//complete trace holds all the moves including those that gets erased from choice_trace and propagation_trace during backPropagation() and undoing the changes in sudoku
//(undo the change when the choice do not lead to solution). Unlike choice_trace and propagation_trace, which are used in algorithm for backPropagation and undoing
//complete_trace is not used for any purpose inside algorithm other than record all the moves.
//This can also be taken as a reference for number of steps algorithm took to solve the given instance of sudoku
var steps_counter;
var backtrack_counter;

function clearPreviousSolution() {
    initializeEmptyGrid();
    // row_unit = [[], [], [], [], [], [], [], [], []]
    // col_unit = [[], [], [], [], [], [], [], [], []];
    // box_unit = [[], [], [], [], [], [], [], [], []];
    // peers = [[], [], [], [], [], [], [], [], []];
    constraint = [[], [], [], [], [], [], [], [], []];
    complete_trace = { 'choice_trace': [], 'propagation_trace': [] };
    // console.log(complete_trace);
    propagation_trace = [];
    // console.log(propagation_trace);
    choice_trace = [];

    test_input = false
    user_input = false
}

function displayConstraintsForDebug() {
    if (!debug) return;
    if (!Array.isArray(constraint[0]) && constraint[0].length == 0) return; // because constraint is not yet initialized
    var string = '';
    for (i = 0; i < 9; i++) {
        string += JSON.stringify(constraint[i]);
        string += '\n';
    }
    console.log(string);
}


function useDemoInput(number) {
    test_input = true;
    user_input = false;
    sudoku_grid = [];

    switch(number){
      case 1:
        sudoku_grid = [[0,0,0,0,0,0,8,0,1],[6,0,0,2,0,0,0,0,0],[0,0,0,7,0,5,0,0,0],[0,0,0,6,0,0,0,2,0],[0,1,0,0,0,0,3,0,0],[0,8,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,7,0],[0,3,0,0,8,0,0,0,0],[5,0,0,0,4,0,0,0,0]]; // sudoku_grid.push([0, 1, 0, 4, 0, 9, 0, 0, 0]);
        // sudoku_grid.push([0, 0, 4, 0, 0, 0, 3, 0, 5]);
        // sudoku_grid.push([0, 8, 0, 3, 0, 0, 0, 7, 0]);
        // sudoku_grid.push([3, 0, 0, 6, 0, 7, 1, 0, 9]);
        // sudoku_grid.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        // sudoku_grid.push([6, 0, 9, 5, 0, 3, 0, 0, 2]);
        // sudoku_grid.push([0, 7, 0, 0, 0, 5, 0, 6, 0]);
        // sudoku_grid.push([9, 0, 5, 0, 0, 0, 4, 0, 0]);
        // sudoku_grid.push([0, 0, 0, 7, 0, 6, 0, 9, 0]);
        break;
      case 2:
        sudoku_grid.push([0,3,0,4,8,0,6,0,9]);
        sudoku_grid.push([0,0,0,0,2,7,0,0,0]);
        sudoku_grid.push([8,0,0,3,0,0,0,0,0]);
        sudoku_grid.push([0,1,9,0,0,0,0,0,0]);
        sudoku_grid.push([7,8,0,0,0,2,0,9,3]);
        sudoku_grid.push([0,0,0,0,0,4,8,7,0]);
        sudoku_grid.push([0,0,0,0,0,5,0,0,6]);
        sudoku_grid.push([0,0,0,1,3,0,0,0,0]);
        sudoku_grid.push([9,0,2,0,4,8,0,1,0]);
        break;
      case 3:
        sudoku_grid.push([0,0,0,0,0,0,8,0,2]);
        sudoku_grid.push([0,0,4,9,0,0,5,6,0]);
        sudoku_grid.push([0,0,0,7,2,0,0,0,9]);
        sudoku_grid.push([3,6,0,0,0,1,0,0,0]);
        sudoku_grid.push([0,8,7,0,4,0,6,5,0]);
        sudoku_grid.push([0,0,0,2,0,0,0,7,8]);
        sudoku_grid.push([5,0,0,0,1,8,0,0,0]);
        sudoku_grid.push([0,1,8,0,0,7,2,0,0]);
        sudoku_grid.push([7,0,9,0,0,0,0,0,0]);
        break;
      case 4:
        sudoku_grid.push([0,0,1,0,4,8,0,6,0]);
        sudoku_grid.push([2,0,5,9,3,0,0,0,0]);
        sudoku_grid.push([0,0,7,0,0,0,9,8,3]);
        sudoku_grid.push([8,0,0,0,7,0,0,2,0]);
        sudoku_grid.push([7,3,0,5,0,2,0,4,6]);
        sudoku_grid.push([0,2,0,0,6,0,0,0,9]);
        sudoku_grid.push([4,1,3,0,0,0,6,0,0]);
        sudoku_grid.push([0,0,0,0,9,4,1,0,2]);
        sudoku_grid.push([0,7,0,6,8,0,5,0,0]);
        break;
      case 5:
        sudoku_grid.push([3,0,0,0,2,0,0,0,8]);
        sudoku_grid.push([0,0,5,0,1,0,9,0,0]);
        sudoku_grid.push([0,0,0,7,0,9,0,0,0]);
        sudoku_grid.push([0,2,0,4,8,3,0,6,0]);
        sudoku_grid.push([0,0,0,0,0,0,0,0,0]);
        sudoku_grid.push([0,8,0,1,7,6,0,5,0]);
        sudoku_grid.push([0,0,0,8,0,1,0,0,0]);
        sudoku_grid.push([0,0,1,0,4,0,5,0,0]);
        sudoku_grid.push([7,0,0,0,9,0,0,0,4]);
        break;
      case 6:
        sudoku_grid.push([2,0,0,0,0,6,0,0,1]);
        sudoku_grid.push([0,0,9,4,0,1,0,0,0]);
        sudoku_grid.push([0,0,7,0,0,0,8,6,0]);
        sudoku_grid.push([6,2,0,0,4,0,0,7,0]);
        sudoku_grid.push([0,0,0,7,0,8,0,0,0]);
        sudoku_grid.push([0,8,0,0,9,0,0,5,3]);
        sudoku_grid.push([0,9,3,0,0,0,7,0,0]);
        sudoku_grid.push([0,0,0,3,0,9,2,0,0]);
        sudoku_grid.push([8,0,0,6,0,0,0,0,4]);
      break;
      default:
        sudoku_grid.push([7,0,0,0,5,0,0,9,0]);
        sudoku_grid.push([0,0,0,8,9,0,0,0,0]);
        sudoku_grid.push([9,6,0,0,0,0,2,0,0]);
        sudoku_grid.push([0,1,0,0,0,6,3,0,9]);
        sudoku_grid.push([0,3,0,0,0,0,0,4,0]);
        sudoku_grid.push([2,0,4,3,0,0,0,8,0]);
        sudoku_grid.push([0,0,9,0,0,0,0,2,1]);
        sudoku_grid.push([0,0,0,0,1,8,0,0,0]);
        sudoku_grid.push([0,2,0,0,3,0,0,0,7]);
        break;
    }
    displaySudokuInConsole();
}

// function displaySudokuInConsole(matrix) {
//     var string = '';
//     for (i = 0; i < 9; i++) {
//         for (j = 0; j < 9; j++) {
//             if (matrix[i][j] === 0) string += '*';
//             else string += matrix[i][j];
//             if (j < 8) string += '-----'
//         }
//         //console.log(string);
//
//         if (i < 8) {
//             string += "\n|     |     |     |     |     |     |     |     |";
//             //console.log(string);
//         }
//         string += '\n';
//     }
//
//     console.log(string);
// }

function initialzeUnits() {
    //initializing row_units and column_units and box_units
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            row_unit[i].push([i, j]);
            col_unit[i].push([j, i]);

            let n = 0;
            if (i < 3) {
                if (j < 3) {
                    n = 0;
                } else if (j < 6) {
                    n = 1;
                } else {
                    n = 2;
                }
            } else if (i < 6) {
                if (j < 3) {
                    n = 3;
                } else if (j < 6) {
                    n = 4;
                } else {
                    n = 5;
                }
            } else {
                if (j < 3) {
                    n = 6;
                } else if (j < 6) {
                    n = 7;
                } else {
                    n = 8;
                }
            }

            box_unit[n].push([i, j])
        }
    }
}

function initializePeers() {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            peers[i].push([]);
            peers[i][j].push(i); //row_unit  cell (i,j) belongs to
            peers[i][j].push(j); //column_unit cell (i,j) belongs to
            //box_unit cell(i,j) belongs to
            if (i < 3) {
                if (j < 3) {
                    peers[i][j].push(0);
                } else if (j < 6) {
                    peers[i][j].push(1);
                } else {
                    peers[i][j].push(2);
                }
            } else if (i < 6) {
                if (j < 3) {
                    peers[i][j].push(3);
                } else if (j < 6) {
                    peers[i][j].push(4);
                } else {
                    peers[i][j].push(5);
                }
            } else {
                if (j < 3) {
                    peers[i][j].push(6);
                } else if (j < 6) {
                    peers[i][j].push(7);
                } else {
                    peers[i][j].push(8);
                }
            }
        }
    }
}

function initializeConstraint() {
    //constraint
    // for constraint array, arrayIndex + 1 is the real value that is placed in the sudoku. the value in constraint pointed by index is flag.
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var temp = [];
            if (sudoku_grid[i][j] == 0) {
                for (var k = 0; k < 9; k++) {
                    temp.push(k + 1); // 1 means possible value for cell (i,j)// index number is the value and value pointed by index is flag
                }
                temp.push(0); // index 9 value 10 means its input
            }
            else temp.push(10); //index 9 value 0 means changeable
            constraint[i].push(temp);
        }
    }
    initialPropagation();
}

function initialPropagation() {
    if(debug) console.log('initialPropagation(): ')
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (sudoku_grid[i][j] != 0) {
                if (debug) {
                    console.log('position: [', i, j, '] -- value: ', sudoku_grid[i][j]);
                }
                forwardPropagation(i, j, sudoku_grid[i][j]);
            }
        }
    }

    if (debug) {
        console.log("propagation trace of initial propagation: ", propagation_trace, '\n it is of no use. So it is cleared.------------\n---------------');
        console.log("choice_trace is also of no use: ", choice_trace);
    }
    propagation_trace = [];
    choice_trace = [];
    complete_trace['choice_trace'] = [];
    complete_trace['propagation_trace'] = [];
}


initializePeers();

if (debug) console.log("peers initialized: \n", JSON.stringify(peers));

initialzeUnits();

if (debug) {
    console.log("Row Units Initialized: \n", JSON.stringify(row_unit))
    console.log("Column Units Initialized: \n", JSON.stringify(col_unit))
    console.log("Box Units Initialized: \n", JSON.stringify(box_unit))
}

//------ --- ---- ----------  -- ---  ----
//------- - ---- - --------    - -     ---
//-------- ---- --- -----------   ----------

function arrayRowToHTMLid(i) {
    var col;
    switch (i) {
        case 0: col = 'A'; break;
        case 1: col = 'B'; break;
        case 2: col = 'C'; break;
        case 3: col = 'D'; break;
        case 4: col = 'E'; break;
        case 5: col = 'F'; break;
        case 6: col = 'G'; break;
        case 7: col = 'H'; break;
        case 8: col = 'I'; break;
        default: col = 'A'; break;
    }
    return col;
}


function forwardPropagation(I, J, value) {// I==row, J==column
    if (debug) console.log('forwardPropagation(): for cell[',I,J,"]: ",value);
    // removing value from the constraint of cell(I,J) and pushing it to choice_trace
    choice_trace.push({ 'pos': [I, J], 'value': value });
    complete_trace['choice_trace'].push({ 'pos': [I, J], 'value': value, 'propagation':'forward' });
    var temp = [];
    for (x in constraint[I][J]) {
        if (constraint[I][J][x] !== value) {
            temp.push(constraint[I][J][x]);
        } else { ; }
    }
    constraint[I][J] = temp;
    //---------

    var propagationTrace = [];
    //return;
    var row = row_unit[peers[I][J][0]];
    var col = col_unit[peers[I][J][1]];
    var box = box_unit[peers[I][J][2]];
    ////console.log(I, J, value);
    for (let i = 0; i < 9; i++) {
        var r = row[i];
        var c = col[i];
        var b = box[i];
        //for row
        ////console.log(r[0], r[1]);
        if (r[0] == I && r[1] == J);// //console.log('matched row', constraint[r[0]][r[1]]);
        else {
            ////console.log(constraint[r[0]][r[1]], ' before propagation');
            temp = [];
            for (x in constraint[r[0]][r[1]]) {
                if (constraint[r[0]][r[1]][x] != value) {
                    temp.push(constraint[r[0]][r[1]][x]);
                } else {
                    propagationTrace.push({ 'pos': [r[0], r[1]], 'value': value });
                }
            }
            constraint[r[0]][r[1]] = temp;
            ////console.log(constraint[r[0]][r[1]], ' after propagation');
        }

        //for column
        ////console.log(c[0], c[1]);
        if (c[0] == I && c[1] == J);// //console.log('matched column,', constraint[c[0]][c[1]]);
        else {
            ////console.log(constraint[c[0]][c[1]], ' before propagation');
            temp = [];
            for (x in constraint[c[0]][c[1]]) {
                if (constraint[c[0]][c[1]][x] != value) {
                    temp.push(constraint[c[0]][c[1]][x]);
                } else {
                    propagationTrace.push({ 'pos': [c[0], c[1]], 'value': value });
                }

            }
            constraint[c[0]][c[1]] = temp;
            ////console.log(constraint[c[0]][c[1]], ' after propagation');
        }

        //for box
        ////console.log(b[0], b[1]);
        if (b[0] == I && b[1] == J);// //console.log('matched box', constraint[b[0]][b[1]]);
        else {
            ////console.log(constraint[b[0]][b[1]], ' before propagation');
            temp = [];
            for (x in constraint[b[0]][b[1]]) {
                if (constraint[b[0]][b[1]][x] != value) {
                    temp.push(constraint[b[0]][b[1]][x]);
                } else {
                    propagationTrace.push({ 'pos': [b[0], b[1]], 'value': value });
                }

            }
            constraint[b[0]][b[1]] = temp;
            ////console.log(constraint[b[0]][b[1]], ' after propagation');
        }
    }
    ////console.log('propagationTrace', propagationTrace);
    propagation_trace.push(propagationTrace);
    complete_trace['propagation_trace'].push(propagationTrace);
}

function backwardPropagation() {
    //console.log(constraint);

    //------
    var ptrace = propagation_trace.pop();

    for (var x in ptrace) {
        var traceX = ptrace[x];
        var i = traceX['pos'][0];
        var j = traceX['pos'][1];
        // constraint[i][j].unshift(traceX['value']);
        var t = constraint[i][j].pop(); // because last element is a flag that determines if its a input or not
        constraint[i][j].push(traceX['value']); // inserting value to the end of the constraint because it is unlikely the result
        constraint[i][j].push(t); // inserting the flag
    }
}

function minimumConstraint() { // searches for cell with minimum choices left
    var min_val = 9;
    var min_pos = [];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (constraint[i][j].length - 1 < min_val && constraint[i][j].length > 1 && sudoku_grid[i][j] == 0) {
                min_val = constraint[i][j].length - 1; // because each cell has one extra value at the end in constraint indicating whether its input or not
                min_pos = [];
                min_pos.push([i, j]);
            }

            else if (constraint[i][j].length - 1 == min_val && sudoku_grid[i][j] == 0) {
                min_pos.push([i, j]);
            }

            else; //do nothing
        }
    }
    // console.log('-----------------')
    temp_min_pos = []
    if(min_val < 4 && min_val>0 && min_pos.length>2){
      for(x in min_pos){
        for(y=x;y<min_pos.length;y++){
          if(x!=y){
            i1 = min_pos[x][0];
            j1 = min_pos[x][1];
            i2 = min_pos[y][0];
            j2 = min_pos[y][1];
            if(JSON.stringify(constraint[i1][j1].sort(function(a,b){return b-a}))==JSON.stringify(constraint[i2][j2].sort(function(a,b){return b-a}))) {//if the contents of constraint are same
              if(i1==i2 || j2==j2 || box_unit_index_from_cell_pos(i1,j1)==box_unit_index_from_cell_pos(i2,j2)){// row or column or box
                temp_min_pos.push([i1,j1])
                temp_min_pos.push([i2,j2])
              }
            }
          }
        }
        // console.log(JSON.stringify(constraint[min_pos[x][0]][min_pos[x][1]]));
      }
      if(temp_min_pos.length>0) min_pos = [... new Set(temp_min_pos)]
    }
    // console.log(JSON.stringify(min_pos))
    // console.log('----/-------/------')
    return [min_pos[0]];
}

var g_counter = 0;

function box_unit_index_from_cell_pos(i,j){
  if(i<3){
    if(j<3) return 0;
    if(j<6) return 1;
    return 2;
  }
  else if(i<6){
    if(j<3) return 3;
    if(j<6) return 4;
    return 5;
  }
  else {
    if(j<3) return 6;
    if(j<6) return 7;
    return 8;
  }
}

function check_through_column_unit(indexI,indexJ,value){
    // console.log('check_through_column_unit',indexI,indexJ,value)
    for(index in col_unit[indexJ]){
      if(col_unit[indexJ][index][0]!=indexI){
        // console.log(col_unit[indexJ][index][0],col_unit[indexJ][index][1])
        cnstrnt = constraint[col_unit[indexJ][index][0]][col_unit[indexJ][index][1]];
        // console.log(JSON.stringify(cnstrnt))
        if(cnstrnt.length==1){
          if(sudoku_grid[col_unit[indexJ][index][0]][col_unit[indexJ][index][1]] == value) return false
        } else {
          for(x in cnstrnt){
            if(cnstrnt[x]==value) return false
          }
        }
      }
    }
    return true
}

function check_through_row_unit(indexI,indexJ,value){
    // console.log('check_through_row_unit',indexI,indexJ,value)
    for(index in row_unit[indexI]){
      if(row_unit[indexI][index][1]!=indexJ){
        // console.log(row_unit[indexI][index][0],row_unit[indexI][index][1])
        cnstrnt = constraint[row_unit[indexI][index][0]][row_unit[indexI][index][1]];
        // console.log(JSON.stringify(cnstrnt))
        if(cnstrnt.length==1){
          if(sudoku_grid[row_unit[indexI][index][0]][row_unit[indexI][index][1]] == value) return false
        } else {
          for(x in cnstrnt){
            if(cnstrnt[x]==value) return false
          }
        }
      }
    }
    return true
}
//
function check_through_box_unit(indexI,indexJ,value){
    for(index in box_unit[box_unit_index_from_cell_pos(indexI,indexJ)]){
      if(row_unit[indexI][index][0]!=indexI && row_unit[indexI][index][1]!=indexJ){
        cnstrnt = constraint[row_unit[indexI][index][0]][row_unit[indexI][index][1]];
        if(cnstrnt.length==1){
          if(sudoku_grid[row_unit[indexI][index][0]][row_unit[indexI][index][1]] == value) return false
        } else {
          for(x in cnstrnt){
            if(x==value) return false
          }
        }
      }
    }
    return true
}
//
function RBinteraction(){
  rb_trace = [];
  for(i=0;i<9;i++){
    for(j=0;j<9;j++){//in each cell in sudoku grid
      if(constraint[i][j].length>2){//if there is more than 1 constraint
        for(k=0;k<constraint[i][j].length-1;k++){//for each constraint, check if it is unique
          row_flag = check_through_row_unit(i,j,constraint[i][j][k])
          box_flag = check_through_box_unit(i,j,constraint[i][j][k])
          if(row_flag && box_flag){
            // console.log(i,j,JSON.stringify(constraint[i][j]),constraint[i][j][k])
            sudoku_grid[i][j] = constraint[i][j][k];
            forwardPropagation(i, j, constraint[i][j][k]);
            rb_trace.push({'pos':[i,j],'value':constraint[i][j][k]});
          }
        }
      }
    }
  }
  return rb_trace;
}

function CBinteraction(){
  cb_trace = [];
  for(i=0;i<9;i++){
    for(j=0;j<9;j++){//in each cell in sudoku grid
      if(constraint[i][j].length>2){//if there is more than 1 constraint
        for(k=0;k<constraint[i][j].length-1;k++){//for each constraint, check if it is unique
          row_flag = check_through_column_unit(i,j,constraint[i][j][k])
          box_flag = check_through_box_unit(i,j,constraint[i][j][k])
          if(row_flag && box_flag){
            // console.log(i,j,JSON.stringify(constraint[i][j]),constraint[i][j][k])
            sudoku_grid[i][j] = constraint[i][j][k];
            forwardPropagation(i, j, constraint[i][j][k]);
            cb_trace.push({'pos':[i,j],'value':constraint[i][j][k]});
          }
        }
      }
    }
  }
  return cb_trace;
}

flag_one = true;
function solutionFinder() {
    if (visualize) {
        console.log('displaySudokuInConsole: ');
        displaySudokuInConsole();
    }
    var min_list = minimumConstraint();
    var selected_min;
    var min_pos;
    counter = min_list.length;
    while(counter>0){
      counter--;
      if (min_list.length > 1) {
        if(random){
          selected_min = getRandomNumber(0, (min_list.length - 1));
          min_pos = min_list[selected_min]; // randomly selecting out of minimum constraints;
          min_list.splice(selected_min,1);
        } else {
           min_pos = min_list[counter];
           min_list.splice(counter,1);
        }
      }
      else{
         min_pos = min_list[0];
         min_list.splice(0,1);
      }

      if (!Array.isArray(min_pos)) return false;

      if (debug) {
          console.log('list of position with minimum constraint: \n', min_list, "\n random selection of position: ", min_pos)
          console.log('choices possible in selected position: ', constraint[min_pos[0]][min_pos[1]])
      }

      var cns = [... constraint[min_pos[0]][min_pos[1]]];//cloning
      rb_trace = [];
      cb_trace = [];

      if(row_block_interaction){
        if(cns.length==2 && flag_one){//cns.length=2 means there is one constraint
          flag_one = true;
        } else {
          flag_one = false;
          // return false;
        }

        if(flag_one){
          console.log('flag one')
          //there is no way to backpropagate, so this can be the safest way to do it
          rb_trace = RBinteraction();
          cb_trace = CBinteraction();
        }
      }

      while (cns.length > 1) {
          var insert_value;
          //-----------
          if(!random){
            insert_value = cns.shift() //choices are retrieved from constraint as a queue
          } else {
            random_index = getRandomNumber(0, (cns.length - 2)); //randomly selecting values
            temp = [];

            for(i=0;i<cns.length-1;i++){
              if(random_index==i){
                insert_value = cns[i];
              } else {
                temp.push(cns[i]);
              }
            }
            temp.push(cns.length-1);
            cns = temp;

          }
          //--------------
          sudoku_grid[min_pos[0]][min_pos[1]] = insert_value;
          if (visualize) {
              console.log('displaySudokuInConsole: ');
              displaySudokuInConsole();
          }

          forwardPropagation(min_pos[0], min_pos[1], insert_value);
          var cell_left = checkAllFilled();

          if (cell_left > 0) {// no solution found yet
              if (debug) console.log(cell_left, ' number of empty cells remains')
          } else return true; // possibly solution is found

          var status = solutionFinder();
          if (status)  return true; //solution found

          //if solution is not found with insert_value undo the changes
          var trace = choice_trace.pop();
          var pos = trace['pos'];
          var value = trace['value'];
          //console.log('inside backwardPropagation....', pos);
          if (!Array.isArray(pos)) return;
          sudoku_grid[pos[0]][pos[1]] = 0; //emptying the cell
          constraint[pos[0]][pos[1]].unshift(value);
          // var t = constraint[pos[0]][pos[1]].pop(); // because last element is a flag that determines if its a input or not
          // constraint[pos[0]][pos[1]].push(value); // inserting value to the end of the constraint because it is unlikely the result
          // constraint[pos[0]][pos[1]].push(t); // inserting the flag
          complete_trace['choice_trace'].push({ 'pos': [pos[0], pos[1]], 'value': 0, 'propagation': 'backward' });

          backwardPropagation();
          if (visualize) {
              console.log('backpropagation --- displaySudokuInConsole: ');
              displaySudokuInConsole();
          }
      }
      for(x in cb_trace){
        i = cb_trace[x]['pos'][0]
        j = cb_trace[x]['pos'][1]
        updateSudoku_grid(i,j,0);
        constraint[pos[0]][pos[1]].unshift(cb_trace[x]['value']);
        backwardPropagation();
      }
      for(x in rb_trace){
        i = rb_trace[x]['pos'][0]
        j = rb_trace[x]['pos'][1]
        updateSudoku_grid(i,j,0);
        constraint[i][j].unshift(rb_trace[x]['value']);
        backwardPropagation();
      }
    }
    return false; //all the possible choices are exhausted and still no solution is found

}

function checkAllFilled() { // checks if all the cells in sudoku is filled;
    var counter=0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (sudoku_grid[i][j] == 0) counter++;
        }
    }
    //console.log('checkAllFilled');
    return counter;
}

function getRandomNumber(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//--------------------------------------------------
//-----------------------------------------------
//--------------------------------------------

function updateSudoku_grid(posI,posJ,value){
    sudoku_grid[posI][posJ] = Number(value);
    //inputPropagations(posI, posJ, value);
}

function checkThroughRow(rowIndex,columnIndex,value){
  var count = [];
  ////console.log('checkThroughRow',value);
  for(var i=0;i<9;i++){
     if (sudoku_grid[rowIndex][i] == value) {
         ////console.log(rowIndex, columnIndex, i, sudoku_grid[rowIndex][i], value)
         if(columnIndex!=i)count.push(i);
     }
  }
    //console.log(count);
  return count;
}

function checkThroughColumn(rowIndex,columnIndex,value){
    var count = [];
    ////console.log('checkThroughColumn','value',value);
    for (var i = 0; i < 9; i++){
        ////console.log(rowIndex, columnIndex, i, sudoku_grid[i][columnIndex], value);
        if(sudoku_grid[i][columnIndex]==value){
          if(rowIndex!=i) count.push(i);
        }
    }
  return count;
}

function getBlockRange(rowcol){
  if(rowcol>=0 && rowcol<3){
    return [0,1,2];
  }
  else if(rowcol>=3 && rowcol<6){
    return [3,4,5];
  }
  else return [6,7,8];
}

function checkThroughBlock(rowIndex, columnIndex, value) {
 // //console.log('checkThroughBlock');
//  //console.log(rowIndex,columnIndex);
  var ri = getBlockRange(rowIndex);
  var ci = getBlockRange(columnIndex);
//  //console.log("row",ri);
  ////console.log("column",ci);

  var count = [];
  for(var i=0;i<3;i++){
    for (var j = 0; j < 3; j++){
      if(sudoku_grid[ri[i]][ci[j]]==value){
        //  //console.log(i, j, sudoku_grid[i][j], value);
        if(!(ri[i]==rowIndex && ci[j]==columnIndex)){
          count.push(ri[i]);
          count.push(ci[j]);
        }
      }
    }
  }
  ////console.log(count);

  return count;
}

function inputSudokuValidator(currentIndexRow, currentIndexColumn, value) {
    user_input = true;
    var flag;
    flag = checkThroughBlock(currentIndexRow,currentIndexColumn,value);
    if(flag.length>0){
        return "There is already a number " + value + " in cell[" +(flag[1]+1)+","+ (flag[0]+1)+"]";
    }
    flag = checkThroughRow(currentIndexRow, currentIndexColumn, value);
    if(flag.length>0){
        return "There is already a number " + value + " in cell[" +(flag[0] + 1)  + "," + (currentIndexRow+1)+"]";
    }
    flag = checkThroughColumn(currentIndexRow, currentIndexColumn,value);
    if(flag.length>0){
        return "There is already a number " + value + " in cell[" +(currentIndexColumn+1)+","+(flag[0]+1)+"]";
    }
    return "success";
}

function inputSudokuComplete() {
    var count = 0;
    var unique = 0;
    var temp = [];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (sudoku_grid[i][j] != 0) {
                count++;
                temp.push(sudoku_grid[i][j]);
            }
        }
    }
    temp = [... new Set(temp)];
    unique = temp.length;
    console.log(count,unique,temp);
    if (count >= 17 && unique >= 8) {
        return true;
    }
    return false;
}

function validateInput() {
    // console.log('inside validate input')
    var i, j;
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            if(sudoku_grid[i][j]!=0){
              var stat = inputSudokuValidator(i,j,sudoku_grid[i][j]);
              // console.log(stat)
              if (stat !== 'success') return false;
            }
        }
    }
    // console.log('half of the validation is complete');
    return inputSudokuComplete();
}

function displaySudokuInConsole() {
    var string = '';
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            string += sudoku_grid[i][j]
            if (j < 8) string += '-----'
        }
        //console.log(string);

        if (i < 8) {
            string += "\n|     |     |     |     |     |     |     |     |";
            //console.log(string);
        }
        string += '\n';
    }
    console.log(string)
}

function copyToInput(){
  window['input_sudoku'] = [];
  for(x in sudoku_grid){
    var temp = [];
    for(y in sudoku_grid[x]){
      temp.push(sudoku_grid[x][y]);
    }
    window['input_sudoku'].push(temp);
  }
}

function solve() {
  flag_one = true;
    if (!user_input && !test_input) return false
    if (user_input) {
        //do some tests first
        if(!validateInput()) return false
    }

    copyToInput();

    initializeConstraint();
    if(row_block_interaction){
      RBinteraction();
      CBinteraction();
    }
    // return false;
    if (debug) {
        console.log("Constraints Intialized: \n");
        displayConstraintsForDebug();
    }

    if (debug) console.log('SolutionFinder is Called: First call');
    var status = solutionFinder();
    // console.log(complete_trace['choice_trace'])
    steps_counter = 0
    backtrack_counter = 0
    for(x in complete_trace['choice_trace']){
      if(complete_trace['choice_trace'][x]['propagation']==='forward'){
        // console.log(JSON.stringify(complete_trace['choice_trace'][x]));
        steps_counter++;
      } else {
        backtrack_counter++;
      }
    }

    if (status) {
      // console.log('count: ',steps_counter,' No.of backtracks: ',backtrack_counter)
        console.log('complete');
        // displaySudokuInConsole();
        return true;
    }
    else return false;
}


//console.log('gcounter ', g_counter);
//console.log(JSON.stringify(constraint));

//tests
