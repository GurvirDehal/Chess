let images = []
const tileSize = 100
let board
let whitesMove = true
let movingPiece
let moving = false
let gameOver = false

function setup() {
  createCanvas(800, 800)

  for (let i = 1; i <= 12; i++) {
    images.push(loadImage(`assets/Chess_Sprite_${i}.png`))
  }
  board = new Board()
}

function draw() {
  background(100)
  showGrid()
  board.show()
}

function showGrid() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 == 1) {
        fill('#769656')
      } else {
        fill('#eeeed2')
      }
      noStroke()
      rect(i * tileSize, j * tileSize, tileSize, tileSize)
    }
  }
}

function mousePressed() {
  const x = floor(mouseX / tileSize)
  const y = floor(mouseY / tileSize)
  if (!gameOver) {
    if (!moving) {
      movingPiece = board.getPieceAt(x, y);
      if (movingPiece && movingPiece.isWhite === whitesMove) {
        // if selected piece is valid and it is it's colors turn
        movingPiece.moving = true; 
      } else {
        // Here so moving stays false
        return;
      }
    } else {
      // Moving is true
      if (movingPiece.canMove(x, y, board, { notHypothetical: true })) {
        movingPiece.move(x, y, board);
        whitesMove = !whitesMove;
      }
      // Done moving
      movingPiece.moving = false; 
    }
    moving = !moving;
  }
}

