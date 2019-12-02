<?php
  header('content-type: application/json; charset=utf-8');
  header("Access-Control-Allow-Origin: *");
  if($_SERVER['REQUEST_METHOD']=="POST" && isset($_POST['index'])){
      $hardsudoku = fopen('top95.txt','r');
      $line = '';
      $list = array();
      $counter = -1;
      while($line = fgets($hardsudoku)){
        $counter++;
        if($_POST['index']!=$counter) continue;
        $temp = array();
        for($i=0;$i<strlen($line);$i++){
          if($i%9==0 && $i!=0){
            array_push($list,$temp);
            $temp = array();
          }
          if($line[$i]=='.')$line[$i] = 0;
          array_push($temp,(integer)$line[$i]);
        }
      }
      echo json_encode($list);

  }
?>
