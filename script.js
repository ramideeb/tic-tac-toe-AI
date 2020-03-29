//create canvas and init screen for the game !! 
var cvs,ctx;
function CreateCanvas(){
  var body = document.getElementById('body');

  cvs = document.createElement('canvas');
  cvs.style.position = 'absolute';
  cvs.style.top = cvs.style.left = cvs.style.bottom = cvs.style.right = 0;
  
  ctx = cvs.getContext('2d');
  body.appendChild(cvs);  
}
var pageW, pageH, boardSize, boardL, boardT, sqSize, sqOffset;
function SetCanvasSize(){
  pageW = cvs.width = window.innerWidth;
  pageH = cvs.height = window.innerHeight;
  
  boardSize = Math.min(pageW, pageH) - 100;


  sqSize = Math.floor((boardSize)/3);
  sqOffset = sqSize+4
  
  boardSize = 3*sqSize +8;

  
  boardL = Math.floor(pageW/2 - boardSize/2);
  boardT = Math.floor(pageH/2 - boardSize/2);
}
var playerTurn, playerFirst = 1, mousedIndex, gameStatus;
function Init(){
  var i;
  
  squares = [];
  for(i = 0; i < 9; i++){
    squares[i] = null;
  }
  
  gameStatus = { winner:null }; 
  playerTurn = 1 - playerFirst;
  playerFirst = 1 - playerFirst;
  mousedIndex = -1;

  if (gameStatus.winner === null){
    playerTurn = 1 - playerTurn;
    if (playerTurn === 1){      
      AIMove(squares,playerTurn);
    }
  }
  mousedIndex = -1;
  Draw();
}


// ------------------------
// CORE FUNCTIONS
// ------------------------

function AddMove(index,player){
  squares[index] = player;
  gameStatus = GetOutcomes(squares);
  if (gameStatus.winner === null){
    playerTurn = 1 - playerTurn;
    if (playerTurn === 1){      
      AIMove(squares,playerTurn);
    }
  }
  mousedIndex = -1;
  Draw();
}

// not done 
function CheckMousePos(mX,mY,click){
  var left,
      top,
      index = -1,
      i,
      j;
  
  for(i = 0; i < 3; i++){
    for(j = 0; j < 3; j++){
      left = boardL + i*sqOffset;
      top = boardT + j*sqOffset;     
      if (squares[i + 3*j] === null && 
        (mX>left && mX<left+sqSize && mY>top && mY<top+sqSize) ){        
        index =i + 3*j;
      }
    }
  }
  
  cvs.style.cursor = (index > -1)? 'pointer' : 'default';
    
  if (click && squares[index]===null){
    AddMove(index, playerTurn);
  }  
}



function FindMoves(board){
  var moves = [],
      i;
  
  for(i = 0; i < 9; i++){
    if (board[i] === null){
      moves.push(i);
    }
  }  
  return (moves.length > 0)? moves : null;
}

function GetOutcomes(board){
  var i,openSquares;
  
  // check for win condition along horizontal and vertical rows
  for(i = 0; i < 3; i++){
    if (board[i] !== null && 
        board[i] === board[i+3] &&
        board[i] === board[i+6]){
      return {
        winner: board[i], 
        squares: [ {x:i,y:0}, {x:i,y:1}, {x:i,y:2} ]
      };
    }

    
    if (board[3*i] !== null && 
        board[3*i] === board[1+3*i] &&
        board[3*i] === board[2+3*i]){
      return {
        winner: board[3*i], 
        squares: [ {x:0,y:i}, {x:1,y:i}, {x:2,y:i} ]
      };
    }
  }
  
  // check for win condition along diagonals
  if (board[0] !== null &&
      board[0] === board[4] &&
      board[0] === board[8]){
    return {
      winner: board[0], 
      squares: [ {x:0,y:0}, {x:1,y:1}, {x:2,y:2} ]
    };
  }
  if (board[6] !== null &&
      board[6] === board[4] &&
      board[6] === board[2]){
    return {
      winner: board[6], 
      squares: [ {x:0,y:2}, {x:1,y:1}, {x:2,y:0} ]
    };
  }
  
  // if no winner found, check for tie
  openSquares = FindMoves(board);
  
  // if moves found, game is not tied
  if (openSquares){
    return {
      winner: null,
      squares: openSquares
    };
  }
  else{
    return { 
      winner: -1,
      squares: null
    };
  }
}






// ------------------------
// AI FUNCTIONS/OBJECTS
// ------------------------

function AIMove(board, player){
  var outcomes = GetOutcomes(board),
      bestMove,
      bestAlphaBeta = -2,
      testAlphaBeta,
      testBoard,
      i;

  for(i = 0; i < outcomes.squares.length; i++){      
    testBoard = board.slice(0);
    testBoard[outcomes.squares[i]] = player;
    testAlphaBeta = AlphaBeta(testBoard, -999, 999, player, false);

    if (testAlphaBeta > bestAlphaBeta){
      bestMove = outcomes.squares[i];
      bestAlphaBeta = testAlphaBeta;
    }
  }

  AddMove(bestMove,player);
};

function AlphaBeta(board, a, b, player, maximizingPlayer){
  var i,
      outcome = GetOutcomes(board),
      childBoard;

  if (outcome.winner !== null){
    if (outcome.winner === player){ return 1; }
    else if (outcome.winner === 1-player){ return -1; }
    else{ return 0; }
  }

  if (maximizingPlayer){

    for(i = 0; i < outcome.squares.length; i++){
      childBoard = board.slice(0);
      childBoard[outcome.squares[i]] = player;
     
      a = Math.max(a, AlphaBeta(childBoard, a, b, player, false));
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
      b = Math.min(b, AlphaBeta(childBoard, a, b, player, true));
      if (b <= a){
        break; //a cut off
      }
    }
    return b;
  }
};



// Drawing functions

function Draw(){
  var i,j ;
  ctx.fillStyle = "rgb(64,208,192)";
  ctx.fillRect(0, 0, pageW, pageH);  
  for(i = 0; i < 3; i++){
    for(j = 0; j < 3; j++){
      DrawSquare(squares[i+3*j],  boardL + i*sqOffset ,
                 boardT + j*sqOffset, sqSize,  (i+3*j === mousedIndex));
    }
  }
  if (gameStatus.winner === 0 || gameStatus.winner === 1){ DrawWinnerLine(); }
}

function DrawSquare(player, left, top, size, isMoused){
  ctx.fillStyle = "rgb(255,255,255)" ;
  ctx.fillRect(left, top, sqSize, sqSize);
  
  if (player === 0 || (playerTurn === 0 && isMoused)){
    DrawX(left, top, size);
  }
  else if (player === 1 || (playerTurn === 1 && isMoused)){
    DrawO(left, top, size);
  }
  else {
    return;
  }
  ctx.lineWidth = (sqSize/10) ;
  ctx.strokeStyle ="rgb(48,48,48)";
  ctx.stroke();
}

function DrawX(left, top, size){
  var x1 = left + 0.2*size,
      x2 = left + 0.8*size,
      y1 = top + 0.2*size,
      y2 = top + 0.8*size;
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.moveTo(x1, y2);
  ctx.lineTo(x2, y1);
}

function DrawO(left, top, size){
  var x = left + 0.5*size,
      y = top + 0.5*size,
      rad = 0.3*size;
  
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, 2*Math.PI, false);
}

function DrawWinnerLine(){
  var x1 = boardL + gameStatus.squares[0].x*sqOffset + 0.5*sqSize,      
      x2 = boardL + gameStatus.squares[2].x*sqOffset + 0.5*sqSize,      
      y1 = boardT + gameStatus.squares[0].y*sqOffset + 0.5*sqSize,
      y2 = boardT + gameStatus.squares[2].y*sqOffset + 0.5*sqSize,
      xMod = 0.2*(x2-x1),
      yMod = 0.2*(y2-y1);
  
  x1 -= xMod;
  x2 += xMod;
  
  y1 -= yMod;
  y2 += yMod;
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  
  ctx.lineWidth = (sqSize/10);
  ctx.strokeStyle = "rgba(255,48,48,0.6)";
  ctx.stroke();
}



window.addEventListener('load',()=>{ CreateCanvas(); SetCanvasSize(); Init(); },false);


window.addEventListener('resize',()=>{ SetCanvasSize(); Draw(); },false);


window.addEventListener('mousemove',(e)=>{ if (playerTurn === 0){CheckMousePos(e.clientX, e.clientY);}},false);


window.addEventListener('mousedown',(e)=>{
if (gameStatus.winner !== null){ Init();} else if (playerTurn === 0){ CheckMousePos(e.clientX, e.clientY, true); }}
,false);
