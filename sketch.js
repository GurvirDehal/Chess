import { WHITE, BLACK, KNIGHT, BISHOP, ROOK, QUEEN, KING, PAWN, Chess } from './Chess.js'
import { getBestMove } from './minimax.js'

new p5(p => {
  let table;
  let mainBoard;
  let currentTurn;
  let movingPiece;
  let moving;
  const whiteAI = false
  const blackAI = true
  const images = []
  const tileSize = 100
  
  p.preload = function() {
    for (let i = 1; i <= 12; i++) {
      images.push(p.loadImage(`assets/Chess_Sprite_${i}.png`))
    }
  }

  p.setup = function () {
    p.createCanvas(800, 800)

    moving = false
    currentTurn = WHITE

    table = {
      [KNIGHT]: {
        [WHITE]: images[2],
        [BLACK]: images[8]
      },
      [BISHOP]: {
        [WHITE]: images[3],
        [BLACK]: images[9]
      },
      [ROOK]: {
        [WHITE]: images[4],
        [BLACK]: images[10]
      },
      [QUEEN]: {
        [WHITE]: images[1],
        [BLACK]: images[7]
      },
      [KING]: {
        [WHITE]: images[0],
        [BLACK]: images[6]
      },
      [PAWN]: {
        [WHITE]: images[5],
        [BLACK]: images[11]
      }
    }
    mainBoard = new Chess()
  }
  
  p.draw = function () {
    p.background(100)
    showGrid()
    for (let i = 0; i < 8; i++) {
      for(let j = 0; j < 8; j++) {
        const piece = mainBoard.getPieceAt(toAlgebraic(i, j))
        if (piece) {
          p.imageMode(p.CENTER)
          if (!movingPiece || piece !== movingPiece.piece) {
            p.image(table[piece.type][piece.color], tileSize * (i + 0.5), tileSize * (j + 0.5), tileSize, tileSize)
          }
        }
      }
    }
    if (movingPiece) {
       p.image(table[movingPiece.piece.type][movingPiece.piece.color], p.mouseX, p.mouseY, tileSize * 1.5, tileSize * 1.5)
    }
  
    runAIs()
  }

  function toAlgebraic(x, y) {
    return "abcdefgh".charAt(x) + (8 - y)
  }
  
  function runAIs() {
    if (blackAI && currentTurn === BLACK && !mainBoard.isGameOver()) {
        const bestMove = getBestMove(mainBoard, currentTurn === WHITE)
        mainBoard.move(bestMove)
        currentTurn = mainBoard.currentTurn
    }
    if (whiteAI && currentTurn === WHITE && !mainBoard.isGameOver()) {
      const bestMove = getBestMove(mainBoard, currentTurn === WHITE)
      mainBoard.move(bestMove)
      currentTurn = mainBoard.currentTurn
    }
  }

  function showGrid() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        p.fill((i + j) % 2 ? '#769656' : '#eeeed2')
        p.noStroke()
        p.rect(i * tileSize, j * tileSize, tileSize, tileSize)
      }
    }
  }
  
  p.mousePressed = function () {
    const x = Math.floor(p.mouseX / tileSize)
    const y = Math.floor(p.mouseY / tileSize)
    if (x < 0 || y < 0 || x > 7 || y > 7) return
    if (!mainBoard.isGameOver()) {
      if (!moving) {
        const piece = mainBoard.getPieceAt(toAlgebraic(x, y))
        if (piece && piece.color === currentTurn) {
          // if selected piece is valid and it is it's colors turn
          // movingPiece.moving = true;
          movingPiece = { piece, coords: toAlgebraic(x, y) }
  
        } else {
          // Here so moving stays false
          return;
        }
      } else {
        mainBoard.move({ 
          from: movingPiece.coords, // algebraic coords
          to:  toAlgebraic(x, y),
          promotion: QUEEN
        })
        currentTurn = mainBoard.currentTurn
        movingPiece = null
  
      }
      moving = !moving;
    }
  }
})

