var sudoku_grid = [];
var row_unit = [[], [], [], [], [], [], [], [], []];
var col_unit = [[], [], [], [], [], [], [], [], []];
var box_unit = [[], [], [], [], [], [], [], [], []];
var peers = [[], [], [], [], [], [], [], [], []];
var constraint = [[], [], [], [], [], [], [], [], []];

function initialzeUnits() {
    //initializing row_units and column_units and box_units
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            row_unit[j].push([j, i]);
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
    // for constraint array, arrayIndex + 1 is the real value that is placed in the sudoku. the value in constraint pointed by index is flag.
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            constraint[i].push([]);
            for (var k = 0; j < 11; k++) {
                constraint[i][j].push(1); // 1 means possible value for cell (i,j)
            }
            constraint[i][j][10] = 9; // means all 9 values are possible initially in any cell; constraint length // not the length of array of constraint though
        }
    }
}

//initializing sudoku_grid;
for(var i=0;i<9;i++){
  sudoku_grid.push([]);
  // console.log(sudoku_grid);
  for(var j=0;j<9;j++){
    sudoku_grid[i][j] = 0;
  }
}
delete i,j;
//end initializing

initializeConstraint();
initializePeers();
initialzeUnits();

//------ --- ---- ----------  ------  ----
//------- - ---- - --------    ---     ---
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


function propagations(I,J,value) {
    var row = peers[I][J][0];
    var col = peers[I][J][1];
    var box = peers[I][J][2];

    for (var i = 0; i < 9; i++) {
        if (row[i][0]!=I && row[i][1]!=J) {
            constraint[row[i][0]][row[i][1]][value] = 0;
            constraint[row[i][0]][row[i][1]][value] -= 1;
        }
    }

}

function updateSudoku_grid(posI,posJ,value){
    sudoku_grid[posI][posJ] = Number(value);
    inputPropagations(posI, posJ, value);
}

function checkThroughRow(rowIndex,columnIndex,value){
  var count = [];
  //console.log('checkThroughRow',value);
  for(var i=0;i<9;i++){
     if (sudoku_grid[rowIndex][i] == value) {
         //console.log(rowIndex, columnIndex, i, sudoku_grid[rowIndex][i], value)
         if(columnIndex!=i)count.push(i);
     }
  }
    console.log(count);
  return count;
}

function checkThroughColumn(rowIndex,columnIndex,value){
    var count = [];
    //console.log('checkThroughColumn','value',value);
    for (var i = 0; i < 9; i++){
        //console.log(rowIndex, columnIndex, i, sudoku_grid[i][columnIndex], value);
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
 // console.log('checkThroughBlock');
//  console.log(rowIndex,columnIndex);
  var ri = getBlockRange(rowIndex);
  var ci = getBlockRange(columnIndex);
//  console.log("row",ri);
  //console.log("column",ci);

  var count = [];
  for(var i=0;i<3;i++){
    for (var j = 0; j < 3; j++){
      if(sudoku_grid[ri[i]][ci[j]]==value){
        //  console.log(i, j, sudoku_grid[i][j], value);
        if(!(ri[i]==rowIndex && ci[j]==columnIndex)){
          count.push(ri[i]);
          count.push(ci[j]);
        }
      }
    }
  }
  //console.log(count);

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

function inpputSudokuComplete() {
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
        console.log(count,unique,temp);
    }
}

function solve() {
    //console.log(JSON.stringify(sudoku_grid));

    //console.log(JSON.stringify(row_unit));
    //console.log(JSON.stringify(col_unit));
    //console.log(JSON.stringify(box_unit));

    console.log(JSON.stringify(peers));
  
}



//tests
