

import './style.css'

//1. Inicializar el Canvas
const canvas=document.querySelector('canvas')
const context=canvas.getContext('2d')


const BLOCK_SIZE=20
const BOARD_WIDTH=14
const BOARD_HEIGHT=30
let score=0
canvas.width=BLOCK_SIZE*BOARD_WIDTH
canvas.height=BLOCK_SIZE*BOARD_HEIGHT

context.scale(BLOCK_SIZE,BLOCK_SIZE)

//3. board
const board=[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,0,0,1,1,1,1],
  [1,1,1,1,1,1,1,1,0,0,1,1,1,1],
  
]

//4. pieza player
const piece={
  position:{x:6,y:0},
  shape:[
    [1,1],
    [1,1]
  ]
}
// 9. random pieces

const PIECES=[
[
  [1,1],
  [1,1],
],
[
  [1,1,1,1,1],
],
[
  [0,1,0],
  [1,1,1],
],
[
  [1,1,1],
  [0,1,0],
],
[
  [1,1,0],
  [0,1,1],
],
[
  [1,0],
  [1,0],
  [1,0],
  [1,1]
],
[
  [0,1,1],
  [1,1,0]
],
[
  [1,1],
  [0,1],
  [0,1],
  [0,1]
],
[
  [1,0],
  [1,0],
  [1,0],
  [1,0]
],
[
  [0,1],
  [0,1],
  [0,1],
  [0,1]
],
[
  [1,0],
  [1,0],
  [1,0],
  [1,1]
],
[
  [0,1],
  [0,1],
  [0,1],
  [1,1]
],



]

//2. game loop
// function update() {
//   draw();
//   window.requestAnimationFrame(update);
// }
let dropCounter=0
let lastTime=0

function update(time=0){
  const deltaTime=time-lastTime
  lastTime=time
  dropCounter+=deltaTime

  if(dropCounter>1000){
    piece.position.y++
    dropCounter=0

    if(checkCollision()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
  

  draw()
  window.requestAnimationFrame(update);
}

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if(value=== 1){
        context.fillStyle='yellow'
        context.fillRect(x,y,1,1)
      }
    })
  })

  piece.shape.forEach((row,y)=>{
    row.forEach((value,x)=>{
       if(value){
        context.fillStyle="red"
        context.fillRect(x+piece.position.x,y + piece.position.y,1,1)
       }
      })
    })
     document.querySelector("span").innerText=score
}

document.addEventListener('keydown',event=>{
  if (event.key === "ArrowLeft") {
    piece.position.x--;
    if (checkCollision()) {
      piece.position.x++;
    }
  }
  
  if (event.key === "ArrowRight") {
    piece.position.x++;
    if (checkCollision()) {
      piece.position.x--;
    }
  }
   if (event.key === "ArrowDown") {
    piece.position.y++;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece()
      removeRows()
    }
  }
  if (event.key === "ArrowUp") {
    const rotated = [];
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = [];
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i]);
      }
      rotated.push(row);
    }
    const previousShape=piece.shape
    piece.shape = rotated
    if(checkCollision()){
      piece.shape=previousShape
    }
  }
})




function checkCollision(){
  return piece.shape.find((row,y)=>{
    return row.find((value,x)=>{
      return (
        value !==0 &&
        
        board[y + piece.position.y]?.[x + piece.position.x]!==0
        );
    });
  });
}

function solidifyPiece(){
  piece.shape.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if(value ===1){
        board[y + piece.position.y][x + piece.position.x]= 1;
      }
    })
  })

  piece.shape=PIECES[Math.floor(Math.random()*PIECES.length)]
  piece.position.x=Math.floor(Math.random()*BOARD_WIDTH*0.7)
  piece.position.y=0

  if(checkCollision()){
    window.alert("Game Over!")
    board.forEach((row)=>row.fill(0))

  }

}

function removeRows(){
  const rowsToRemove=[]

  board.forEach((row,y)=>{
    if(row.every(value=>value===1)){
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y=>{
    board.splice(y,1)
    const newRow= Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score +=100
    if (score ==200) {
      window.alert("Llevas 200 puntos");
    }
    if (score === 300) {
      window.alert("ahora 300");
    }
  })


}

let audioPlaying = false; 
document.querySelector("section").addEventListener("click", () => {
  if (!audioPlaying) { 
    audioPlaying = true; 
    update();
    const audio = new window.Audio("./tetris.mp3");
    audio.volume = 0.5;
    audio.play();
    audio.addEventListener("ended", () => {
      
      audio.currentTime = 0;
      audio.play();
    });
    audio.addEventListener("pause", () => {
      audioPlaying = false; 
    });
  }
});

