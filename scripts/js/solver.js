var sudoku_grid = [];
//initializing sudoku_grid;
for (var i = 0; i < 9; i++) {
    sudoku_grid.push([]);
    // //console.log(sudoku_grid);
    for (var j = 0; j < 9; j++) {
        sudoku_grid[i][j] = 0;
    }
}
delete i, j;
//end initializing

var row_unit = [[], [], [], [], [], [], [], [], []]; // groups cells as per column unit, there are 9 columns in 9*9 sudoku, 9*1
var col_unit = [[], [], [], [], [], [], [], [], []]; // groups cells as per row unit, there are 9 row units in 9*9 sudoku, 1*9
var box_unit = [[], [], [], [], [], [], [], [], []]; // groups cells as per box unit, each box unit is group of 3*3, there are 9 box unit in 9*9 sudoku
var peers = [[], [], [], [], [], [], [], [], []]; // contains peers, index to row_unit, col_unit and box_unit for each cell
var constraint = [[], [], [], [], [], [], [], [], []]; // stores possible choices left for any cell in sudoku
var visualize = true;
var debug = false;

var choice_trace = []; // it is a stack that traces the choices made so far. Helps to backtrack
//form: choice_trace = [{'pos':[i,j],'value':value},......]
var propagation_trace = []; //corresponds to the choice_trace. keeps track of effect of choice on constraint of its peers
//form: propagation_trace = [[{'pos':[i,j],'value':value},......],........]
// here 'pos' is position of peers and doesn't match 'pos' in choice_trace but 'value' does correspond i.e. is equal

var solution_trace = []; //records the moves that leads to the solution for the purpose of visualization

function getSudoku() {
    return sudoku_grid;
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


function useDemoInput() {
    sudoku_grid = [];
    sudoku_grid.push([0, 1, 0, 4, 0, 9, 0, 0, 0]);
    sudoku_grid.push([0, 0, 4, 0, 0, 0, 3, 0, 5]);
    sudoku_grid.push([0, 8, 0, 3, 0, 0, 0, 7, 0]);
    sudoku_grid.push([3, 0, 0, 6, 0, 7, 1, 0, 9]);
    sudoku_grid.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    sudoku_grid.push([6, 0, 9, 5, 0, 3, 0, 0, 2]);
    sudoku_grid.push([0, 7, 0, 0, 0, 5, 0, 6, 0]);
    sudoku_grid.push([9, 0, 5, 0, 0, 0, 4, 0, 0]);
    sudoku_grid.push([0, 0, 0, 0, 0, 6, 0, 9, 0]);
    displaySudokuInConsole();
}

function displaySudokuInConsole() {
    var string = '';
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            if (sudoku_grid[i][j] === 0) string += '*';
            else string += sudoku_grid[i][j];
            if (j < 8) string += '-----'
        }
        //console.log(string);

        if (i < 8) {
            string += "\n|     |     |     |     |     |     |     |     |";
            //console.log(string);
        }
        string += '\n';
    }

    console.log(string);
}

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
    constraint
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
}

function backwardPropagation() {
    //console.log(constraint);

    //------
    var ptrace = propagation_trace.pop();
    console.log('ptrace', ptrace);

    for (var x in ptrace) {
        var traceX = ptrace[x];
        var i = traceX['pos'][0];
        var j = traceX['pos'][1];
        constraint[i][j].unshift(traceX['value']);
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
    return min_pos;
}

var g_counter = 0;

function solutionFinder() {
    if (visualize) {
        console.log('displaySudokuInConsole: ');
        displaySudokuInConsole();
    }
    var min_list = minimumConstraint();
    var selected_min;
    var min_pos;
    if (min_list.length > 1) {
        selected_min = getRandomNumber(0, (min_list.length - 1));
        min_pos = min_list[selected_min]; // randomly selecting out of minimum constraints;
    }
    else min_pos = min_list[0];

    if (!Array.isArray(min_pos)) return false;

    if (debug) {
        console.log('list of position with minimum constraint: \n', min_list, "\n random selection of position: ", min_pos)
        console.log('choices possible in selected position: ', constraint[min_pos[0]][min_pos[1]])
    }

    var cns = [...constraint[min_pos[0]][min_pos[1]]];//cloning
    while (cns.length > 1) {
        var insert_value = cns.shift() //choices are retrieved from constraint as a queue

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
        if (status) {
            solution_trace.push()
            return true; //solution found
        }


        //if solution is not found with insert_value undo the changes
        var trace = choice_trace.pop();
        var pos = trace['pos'];
        var value = trace['value'];
        console.log('inside backwardPropagation....', pos);
        if (!Array.isArray(pos)) return;
        sudoku_grid[pos[0]][pos[1]] = 0; //emptying the cell
        var t = constraint[pos[0]][pos[1]].pop(); // because last element is a flag that determines if its a input or not
        constraint[pos[0]][pos[1]].push(value); // inserting value to the end of the constraint because it is unlikely the result
        constraint[pos[0]][pos[1]].push(t); // inserting the flag

        backwardPropagation();
        if (visualize) {
            console.log('backpropagation --- displaySudokuInConsole: ');
            displaySudokuInConsole();
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
    var flag;
  flag = checkThroughBlock(currentIndexRow,currentIndexColumn,value);
  if(flag.length>0){
      return "There is already a number " + value + " in " + arrayRowToHTMLid(flag[0])+""+(flag[1]+1);
    }
    flag = checkThroughRow(currentIndexRow, currentIndexColumn, value);
  if(flag.length>0){
      return "There is already a number " + value + " in " + arrayRowToHTMLid(currentIndexRow) + "" + (flag[0] + 1);
  }
    flag = checkThroughColumn(currentIndexRow, currentIndexColumn,value);
  if(flag.length>0){
      return "There is already a number " + value + " in " +arrayRowToHTMLid(flag[0])+""+(currentIndexColumn+1);
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
    if (count >= 17 && unique >= 8) {
        return true;
        //console.log(count,unique,temp);
    }
    return false;
}

function validateInput() {
    var i, j;
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            if (inputSudokuValidator() !== 'success') return false;
            if (!flag) break;
        }
    }

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

function solve() {
    initializePeers();

    if (debug) console.log("peers initialized: \n", JSON.stringify(peers));

    initialzeUnits();

    if (debug) {
        console.log("Row Units Initialized: \n", JSON.stringify(row_unit))
        console.log("Column Units Initialized: \n", JSON.stringify(col_unit))
        console.log("Box Units Initialized: \n", JSON.stringify(box_unit))
    }

    initializeConstraint();

    if (debug) {
        console.log("Constraints Intialized: \n");
        displayConstraintsForDebug();
    }

    if (debug) console.log('SolutionFinder is Called: First call');
    solutionFinder();
    if(debug) console.log('complete');
}

useDemoInput();
solve();

//console.log('gcounter ', g_counter);
//console.log(JSON.stringify(constraint));

//tests
