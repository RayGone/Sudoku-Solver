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


function updateSudoku_grid(posI,posJ,value){
  sudoku_grid[posI][posJ] = Number(value);
}

function checkThroughRow(rowIndex,columnIndex,value){
  var count = [];
  for(var i=0;i<9;i++){
    if(sudoku_grid[rowIndex][i]==value){
      if(columnIndex!=i)count.push[i];
    }
  }
  return count;
}

function checkThroughColumn(rowIndex,columnIndex,value){
  var count = [];
  for(var i=0;i<9;i++){
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

function checkThroughBlock(rowIndex,columnIndex,value){
  console.log(rowIndex,columnIndex);
  var ri = getBlockRange(rowIndex);
  var ci = getBlockRange(columnIndex);
  console.log("row",ri);
  console.log("column",ci);

  var count = [];
  for(var i=0;i<3;i++){
    for(var j=0;j<3;j++){
      if(sudoku_grid[i][j]==value){
        if(i!=rowIndex && j!=columnIndex){
          count.push(i);
          count.push(j);
        }
      }
    }
  }
  return count;
}

function inputSudokuValidator(currentIndexRow,currentIndexColumn,value){
  var flag;
  flag = checkThroughBlock(currentIndexRow,currentIndexColumn,value);
  if(flag.length>0){
    return "There is already a number "+value+" in row: "+flag[0]+" -- column: "+flag[1];
  }
  flag = checkThroughRow(currentIndexRow,value);
  if(flag.length>0){
    return "There is already a number "+value+" in row: "+currentIndexRow+" -- column: "+flag[0];
  }
  flag = checkThroughColumn(currentIndexColumn,value);
  if(flag.length>0){
    return "There is already a number "+value+" in row: "+flag[0]+" -- column: "+currentIndexColumn;
  }

  return "success";
}

function solve(){

}

//tests
