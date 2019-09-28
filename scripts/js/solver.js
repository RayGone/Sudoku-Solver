var sudoku_grid = [];

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

function updateSudoku_grid(posI,posJ,value){
  sudoku_grid[posI][posJ] = Number(value);
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
    if (count >= 17 || unique >= 8) {
        console.log(count,unique,temp);
    }
}

function solve(){

}

//tests
