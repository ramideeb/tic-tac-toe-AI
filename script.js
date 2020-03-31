///////////////////////////////////////////////////////////////////////////////////////////////

var twoPlayers = 0 ,leve1lSt,cvs,ctx;
function CreateCanvas(){
  cvs = document.createElement('canvas');
  cvs.style.position = 'absolute';
  cvs.style.top =0;
  cvs.style.left=0;
  cvs.style.bottom=0;
  cvs.style.right =0;
  ctx = cvs.getContext('2d'); 
  document.getElementById('body').appendChild(cvs);  
}

var  boardSize, boardleft, boardtop, cellSize, celloffset;
function resize(){
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  boardSize = Math.min(cvs.width, cvs.height) -100;
  cellSize = boardSize/3;
  celloffset = cellSize+5;
  boardleft = (cvs.width-boardSize)/2;
  boardtop = (cvs.height- boardSize)/2;
}

var currentPlayer, playerFirst = 0, mouseIN, gameStatus;
function Init(){  
  squares = [];
  for(i = 0; i < 9; i++){
    squares[i] = null;
  }
  gameStatus={winner:null};  
  currentPlayer=1-playerFirst;
  playerFirst=1-playerFirst;
  
  if (gameStatus.winner === null){
    if (currentPlayer === 1 && twoPlayers==0){      
      AIMove(squares,currentPlayer);
    }
  }
  DrawAll();
}

function Insert(index,player){
  squares[index] = player;  
  gameStatus = isEnded(squares);
  if (gameStatus.winner === null){
    currentPlayer = 1 - currentPlayer;
    if (currentPlayer === 1 && twoPlayers==0){      
      AIMove(squares,currentPlayer);
    }
  }
  DrawAll();
}

function MousePosition(mX,mY,click){
  var left, top, index=-1;

  for(i = 0; i < 3; i++){
    for(j = 0; j < 3; j++){

      left = boardleft + i*celloffset;
      top = boardtop + j*celloffset;    
      if (squares[i + 3*j] === null && (mX>left && mX<left+cellSize && mY>top && mY<top+cellSize) ){        
        index = i + 3*j;
      }
    }
  
  }

  if(index>-1){ cvs.style.cursor =  'pointer' ;}
          else{ cvs.style.cursor =  'default' ;}

  if ( click==true && squares[index] === null ){
    Insert(index, currentPlayer);
  }  
}

function find_blanks(board){
  var moves = [],
      i;
  
  for(i = 0; i < 9; i++){
    if (board[i] === null){
      moves.push(i);
    }
  }  
  return (moves.length > 0)? moves : null;
}

function isEnded(board){
  var i , blankcells;

  for(i = 0; i < 3; i++){
    if (board[i] !== null && board[i] === board[i+3] && board[i] === board[i+6]){
      return { winner: board[i], squares: [ {x:i,y:0}, {x:i,y:1}, {x:i,y:2} ] };
    }

    if (board[3*i] !== null && board[3*i] === board[1+3*i] && board[3*i] === board[2+3*i]){
      return { winner: board[3*i],  squares: [ {x:0,y:i}, {x:1,y:i}, {x:2,y:i} ] };
    }
  }

  if (board[0] !== null && board[0] === board[4] && board[0] === board[8]){
    return { winner: board[0],  squares: [ {x:0,y:0}, {x:1,y:1}, {x:2,y:2} ] };
  }

  if (board[6] !== null &&  board[6] === board[4] && board[6] === board[2]){
    return { winner: board[6], squares: [ {x:0,y:2}, {x:1,y:1}, {x:2,y:0} ] };
  }

  blankcells = find_blanks(board);

  if (blankcells){
    return { winner: null, squares: blankcells };
  }
  else{
    return { winner: -1, squares: null};
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

function ev(boarde){

  boarde=boarde.slice(0);
  score=0;
  //check for 2 in line if third blank
  if((boarde[0]=== boarde[1] && boarde[2]===null) ||
     (boarde[0]=== boarde[2] && boarde[1]===null) ||
     (boarde[1]=== boarde[2] && boarde[0]===null)){

      if(boarde[0]===0){score+=10;}else{score-=10}
  }

  if((boarde[3]=== boarde[4] && boarde[5]===null) ||
     (boarde[3]=== boarde[5] && boarde[4]===null) ||
     (boarde[4]=== boarde[5] && boarde[3]===null)){

   if(boarde[0]===0){score+=10;}else{score-=10}
  }

  if((boarde[6]=== boarde[7] && boarde[8]===null) ||
     (boarde[6]=== boarde[8] && boarde[7]===null) ||
     (boarde[7]=== boarde[8] && boarde[6]===null)){

  if(boarde[0]===0){score+=10;}else{score-=10}
  }

  if((boarde[0]=== boarde[3] && boarde[6]===null) ||
     (boarde[0]=== boarde[6] && boarde[3]===null) ||
     (boarde[3]=== boarde[6] && boarde[0]===null)){

   if(boarde[0]===0){score+=10;}else{score-=10}
  }

  if((boarde[1]=== boarde[4] && boarde[7]===null) ||
     (boarde[1]=== boarde[7] && boarde[4]===null) ||
     (boarde[4]=== boarde[7] && boarde[1]===null)){

  if(boarde[0]===0){score+=10;}else{score-=10}
  }

  if((boarde[2]=== boarde[5] && boarde[8]===null) ||
     (boarde[2]=== boarde[8] && boarde[5]===null) ||
     (boarde[5]=== boarde[8] && boarde[2]===null)){

  if(boarde[0]===0){score+=10;}else{score-=10}
  }
    return score;
}

function AIMove(board, player){
  var outcomes = isEnded(board),
      best,
      bestAlphaBeta = -99999,
      testAlphaBeta,
      testBoard;

  


  for(i = 0; i < outcomes.squares.length ; i++){     

    testBoard = board.slice(0);
    testBoard[outcomes.squares[i]] = player;


  if(leve1lSt==2){
    testAlphaBeta = AlphaBeta(4,testBoard, -999, 999, player, false);
  }
  else if(leve1lSt==1){
    testAlphaBeta = AlphaBeta(3 ,testBoard, -999, 999, player, false);
  }
  else{
    testAlphaBeta = AlphaBeta(0 ,testBoard, -999, 999, player, false);
  }


    if (testAlphaBeta > bestAlphaBeta){
      best = outcomes.squares[i];
      bestAlphaBeta = testAlphaBeta;
    }

  }

  Insert(best,player);
};

function AlphaBeta(levels,board, a, b, player, maximizingPlayer){
  var i,outcome = isEnded(board),childBoard;   
  if (outcome.winner !== null ){

    if (outcome.winner === player){ return 100; }

    else if (outcome.winner === 1-player){ return -100; }

    else{ 
        return 0;
    }
  }
  if(levels===0){
    return ev(board)
  }


  if (maximizingPlayer){

    for(i = 0; i < outcome.squares.length; i++){
      childBoard = board.slice(0);
      childBoard[outcome.squares[i]] = player;
      a = Math.max(a, AlphaBeta(levels-1,childBoard, a, b, player, false));
      if(b <= a){
        break; //b cut off
      }
    }
    return a;   
  }

  else{
    for(i = 0; i < outcome.squares.length; i++){
      childBoard = board.slice(0);
      childBoard[outcome.squares[i]] = 1-player;
      b = Math.min(b, AlphaBeta(levels-1,childBoard, a, b, player, true));
      if (b <= a){
        break; //a cut off
      }
    }
    return b;  
  }
  
};

///////////////////////////////////////////////////////////////////////////////////////////////////

function DrawAll(){
 
  ctx.fillStyle = "#F3F3F3";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);  


  for(i = 0; i < 3; i++){
    for(j = 0; j < 3; j++){
      DrawCell(squares[i+3*j],  boardleft + i*celloffset ,
                 boardtop + j*celloffset, cellSize,  (i+3*j === mouseIN));
                }
  }
  if (gameStatus.winner === 0 || gameStatus.winner === 1){ DrawLine(); }
}

function DrawCell(player, left, top, size, MOUSED){

  ctx.fillStyle = "rgb(255,255,255)" ;
  ctx.fillRect(left, top, size, size);
  
  if (player === 0 || (currentPlayer === 0 && MOUSED)){
    Draw_X(left, top, size);
  }
  else if (player === 1 || (currentPlayer === 1 && MOUSED)){
    Draw_O(left, top, size);
  }
  else {
    return;
  }

  ctx.lineWidth = (cellSize/10) ;
  ctx.strokeStyle ="rgb(48,48,48)";
  ctx.stroke();

}

function Draw_X(left, top, size){
  x1 = left + 0.2*size;
  x2 = left + 0.8*size;
  y1 = top + 0.2*size;
  y2 = top + 0.8*size;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.moveTo(x1, y2);
  ctx.lineTo(x2, y1);
}

function Draw_O(left, top, size){
  var x = left + 0.5*size,
      y = top + 0.5*size,
      rad = 0.3*size;
  
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, 2*Math.PI, false);

}


function DrawLine(){
  x1 = boardleft+ gameStatus.squares[0].x*cellSize + 0.5*cellSize;   
  x2 = boardleft+ gameStatus.squares[2].x*cellSize + 0.5*cellSize;      
  y1 = boardtop + gameStatus.squares[0].y*cellSize + 0.5*cellSize;
  y2 = boardtop + gameStatus.squares[2].y*cellSize + 0.5*cellSize;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  
  ctx.lineWidth = cellSize/10;
  ctx.strokeStyle = "rgba(255,48,48,0.6)";
  ctx.stroke();

}

///////////////////////////////////////////////////////////////////////////////////////////////////
var start=0;
function p2(){ 
  twoPlayers=1;
  CreateCanvas(); resize(); Init() ; start=1; 
  document.getElementById("close").style.opacity=1;
  document.getElementById('starting').style.display='none';
  
}

function hard(){ 
  leve1lSt=2;
  CreateCanvas(); resize(); Init() ; start=1; ;
  document.getElementById("close").style.opacity=1;
  document.getElementById('starting').style.display='none';

  
}

function medium (){ 
  leve1lSt=1;
  CreateCanvas(); resize(); Init() ; start=1;
  document.getElementById("close").style.opacity=1;
  document.getElementById('starting').style.display='none';

  
}

function easy(){ 
  leve1lSt=0;
  CreateCanvas(); resize(); Init() ; start=1; 
  document.getElementById("close").style.opacity=1;
  document.getElementById('starting').style.display='none';

  
}

function close(){

  document.getElementById('body').removeChild('canvas');
  document.getElementById('starting').style.display='block';
}
//////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('resize',()=>{ 
  if(start==1){
  resize(); DrawAll(); 
  }

}
,false);

window.addEventListener('mousemove',(e)=>{

if(start==1){

   if ((currentPlayer === 0 && twoPlayers==0 )|| twoPlayers==1){
  
  MousePosition(e.clientX, e.clientY);}
   }


}
,false);

window.addEventListener('mousedown',(e)=>{
  if(start==1){
if (gameStatus.winner !== null){ 
  Init();

} 
  else 
  if ( (currentPlayer === 0 && twoPlayers==0 )|| twoPlayers==1 )
  { 
    MousePosition(e.clientX, e.clientY, true);} }} 
,false);