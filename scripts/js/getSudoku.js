var row = [0,0,0,0,0,0,0,0,0];
var getSudoku = [];
 for(var i=0;i<9;i++){
   getSudoku.push(row);
}
delete row;

function arrayPosToHTMLid(i,j){
  var col;
  switch(i){
    case 0: col='A'; break;
    case 1: col='B'; break;
    case 2: col='C'; break;
    case 3: col='D'; break;
    case 4: col='E'; break;
    case 5: col='F'; break;
    case 6: col='G'; break;
    case 7: col='H'; break;
    case 8: col='I'; break;
    default:  col='A'; break;
  }

  j += 1;
  return col+j;
}
