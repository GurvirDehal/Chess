class Piece {
  constructor(x, y, isWhite, letter, img) {
    this.matrix = createVector(x, y)
    this.pixel = createVector(tileSize * (x + 0.5), tileSize * (y + 0.5))
    this.taken = false
    this.isWhite = isWhite
    this.letter = letter
    this.img = img
    this.moving = false
    this.value = 0
    this.firstMove = true
  }

  show() {
    if (!this.taken) {
      imageMode(CENTER)
      if (this.moving) {
        // Scale the image to make it 1.5 times bigger when it is being 
        // moved by the player
        image(this.img, mouseX, mouseY, tileSize * 1.5, tileSize * 1.5)
      } else {
        image(this.img, this.pixel.x, this.pixel.y, tileSize, tileSize)
      }
    }
  }

  withinBounds(x, y) {
    return (x >=0 && y >= 0 && x < 8 && y < 8)
  }

  attackingAllies(x, y, board, canCover = false) {
    const attacking = board.getPieceAt(x, y)
    if (!canCover) {
      return attacking !== null && attacking.isWhite === this.isWhite
    } 
    if (x === this.matrix.x && y === this.matrix.y) return true
    return false
  }

  putsKingInCheck(x, y, board) {
    let retVal = false
    const attacking = board.getPieceAt(x, y)
    if (attacking) {
      attacking.taken = true
    }
    const temp = this.matrix
    this.matrix = createVector(x, y)
    if (board.kingIsInCheck(this.isWhite).length > 0) {
      retVal = true
    }
    if (attacking) {
      attacking.taken = false
    }
    this.matrix = temp
    return retVal
  }
  
  move(x, y, board) {
    const attacking = board.getPieceAt(x, y)
    if (attacking) {
      attacking.taken = true
    }
    if (board.enPassant && this.isWhite !== board.enPassant.pawn.isWhite) {
      if (this.capturingEnPassant) {
        board.enPassant.pawn.taken = true
      }
      board.enPassant = false
      this.capturingEnPassant = false
    }
    this.matrix = createVector(x, y)
    this.pixel = createVector(tileSize * (x + 0.5), tileSize * (y + 0.5))
    this.firstMove = false
    if (this.castling) {
      this.castling.rook.matrix = createVector(x - this.castling.stepX, y)
      this.castling.rook.pixel = createVector(tileSize * (x - this.castling.stepX + 0.5), tileSize * (y + 0.5))
      this.castling.rook.firstMove = false
      this.castling = false
    }

    const gameState = board.isGameOver(this.isWhite)
    if (gameState !== 0) {
      gameOver = true
      console.log(gameState)
      console.log(gameState === 1 ? 'CHECKMATE!!' : 'STALEMATE!!')
    }

  }

  moveThroughPieces(x, y, board) {
    const stepX = (x === this.matrix.x) ? 0 : (x > this.matrix.x) ? 1 : -1
    const stepY = (y === this.matrix.y) ? 0 : (y > this.matrix.y) ? 1 : -1
    for (let i = this.matrix.x + stepX, j = this.matrix.y + stepY; !(i === x && j === y); i += stepX, j += stepY) {
      if (board.getPieceAt(i, j)) {
        return true
      }
    }
    return false
  }
}

class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite)
    this.letter = 'K'
    this.img = images[isWhite ? 0 : 6]
    this.value = Infinity
    this.castling = false
  }
  isInCheck(x, y, board, canCover = false) {
    const enemyPieces = this.isWhite ? board.blackPieces : board.whitePieces
    const checkingPieces = []
    enemyPieces.forEach(piece => {
      if (!piece.taken && piece.canMove(x, y, board, canCover)) {
        // in check
        checkingPieces.push(piece)
      }
    })
    if(checkingPieces.length > 0) {
      // console.log('CHECK')
    } 
    return checkingPieces
  }
  canMove(x, y, board, canCover = false, hypothetical = true) {
    if (this.taken) return false
    if (!this.withinBounds(x, y)) {
      return false
    }
    if (this.attackingAllies(x, y, board)) {
      return false
    }

    if (Math.abs(x - this.matrix.x) > 1 || Math.abs(y - this.matrix.y) > 1) {
      if (Math.abs(x - this.matrix.x) === 2 && this.firstMove) {
        const castle = board.canCastle(x, y, this)
        if (castle) {
          this.castling = castle
          return true
        }
      }
      return false
    }
    const enemyKing = board.getEnemyKing(this.isWhite)
    if (Math.abs(x - enemyKing.matrix.x) <= 1 && Math.abs(y - enemyKing.matrix.y) <= 1) {
      return false
    }
    return (!this.putsKingInCheck(x, y, board))
  }

  hasLegalMoves(board) {
    if (this.taken) return false
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!(i === 0 && j  ===0) && this.canMove(this.matrix.x + i, this.matrix.y + j, board, true)) {
          return true
        }
      }
    }
    return false
  }
}

class Queen extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite)
    this.letter = 'Q'
    this.img = images[isWhite ? 1 : 7]
    this.value = 9
  }
  canMove(x, y, board, canCover = false, hypothetical = true) {
    if (this.taken) return false
    if (!this.withinBounds(x, y)) {
      return false
    }
    if (this.attackingAllies(x, y, board, canCover)) {
      return false
    }
    // Rook and Bishop
    if (((Math.abs(this.matrix.x - x) === Math.abs(this.matrix.y - y)) || (this.matrix.x === x || this.matrix.y === y)) && 
         (!this.moveThroughPieces(x, y, board) && !this.putsKingInCheck(x, y, board))) {
        return true
    }
    return false
  }
  hasLegalMoves(board) {
    if (this.taken) return false
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!(i === 0 && j  ===0) && this.canMove(this.matrix.x + i, this.matrix.y + j, board)) {
          return true
        }
      }
    }
    return false
  }
}

class Rook extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite)
    this.letter = 'R'
    this.img = images[isWhite ? 4 : 10]
    this.value = 5
  }
  canMove(x, y, board, canCover = false, hypothetical = true) {
    if (this.taken) return false
    if (!this.withinBounds(x, y)) {
      return false
    }
    if (this.attackingAllies(x, y, board, canCover)) {
      return false
    }
    // Rook
    if ((this.matrix.x === x || this.matrix.y === y) && !this.moveThroughPieces(x, y, board) && !this.putsKingInCheck(x, y, board)) {
      return true
    }
    return false
  }
  hasLegalMoves(board) {
    if (this.taken) return false
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if ((i * j === 0) && !(i === 0 && j  ===0) && this.canMove(this.matrix.x + i, this.matrix.y + j, board)) {
          return true
        }
      }
    }
    return false
  }
}

class Bishop extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite)
    this.letter = 'B'
    this.img = images[isWhite ? 3 : 9]
    this.value = 3
  }
  canMove(x, y, board, canCover = false, hypothetical = true) {
    if (this.taken) return false
    if (!this.withinBounds(x, y)) {
      return false
    }
    if (this.attackingAllies(x, y, board, canCover)) {
      return false
    }
    // Bishop
    if ((Math.abs(this.matrix.x - x) === Math.abs(this.matrix.y - y)) && !this.moveThroughPieces(x, y, board) && !this.putsKingInCheck(x, y, board)) {
      return true
    }
    return false
  }
  hasLegalMoves(board) {
    if (this.taken) return false
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!(i === 0 && j  ===0) && (i * j !== 0) && this.canMove(this.matrix.x + i, this.matrix.y + j, board)) {
          return true
        }
      }
    }
    return false
  }
}

class Knight extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite)
    this.letter = 'N'
    this.img = images[isWhite ? 2 : 8]
    this.value = 3
  }
  canMove(x, y, board, canCover = false, hypothetical = true) {
    if (this.taken) return false
    if (!this.withinBounds(x, y)) {
      return false
    }
    if (this.attackingAllies(x, y, board, canCover)) {
      return false
    }
    const xDiff = Math.abs(this.matrix.x - x)
    const yDiff = Math.abs(this.matrix.y - y)
    if ((xDiff === 2 && yDiff === 1 || xDiff === 1 && yDiff === 2) && !this.putsKingInCheck(x, y, board)) {
      return true
    }
    return false
  }
  hasLegalMoves(board) {
    if (this.taken) return false
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        if (!(i === 0 && j  ===0) && Math.abs(i * j) === 2 && this.canMove(this.matrix.x + i, this.matrix.y + j, board)) {
          return true
        }
      }
    }
    return false
  }
}

class Pawn extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite)
    this.letter = 'P'
    this.img = images[isWhite ? 5 : 11]
    this.value = 1
    this.capturingEnPassant = false
  }
  canMove(x, y, board, canCover = false, hypothetical = true) {
    if (!this.withinBounds(x, y)) {
      return false
    }
    if (this.attackingAllies(x, y, board, canCover)) {
      return false
    }
    const xDiff = x - this.matrix.x
    const yDiff = y - this.matrix.y
    const pieceAtXY = board.getPieceAt(x, y)
    if ((Math.abs(xDiff) === Math.abs(yDiff)) && ((this.isWhite && yDiff === -1) || (!this.isWhite && yDiff === 1))) {
      if (canCover || pieceAtXY) {
        if (this.putsKingInCheck(x, y, board)) {
          return false
        }
        return true
      }
      if (board.enPassant && board.enPassant.capturingPawns.includes(this)) {
        const p = board.enPassant.pawn
        const stepY = (this.isWhite) ? -1 : 1 
        if (x === p.matrix.x && y === p.matrix.y + stepY) {
          if (!hypothetical) this.capturingEnPassant = true
          if (this.putsKingInCheck(x, y, board)) {
            return false
          }
          return true
        }
        return false
      }
      return false
    }
    if (xDiff !== 0) {
      return false
    }
    if ((this.isWhite && yDiff === -1) || (!this.isWhite && yDiff === 1)) {
      if (pieceAtXY) {
        return false
      }
      if (this.putsKingInCheck(x, y, board)) {
        return false
      }
      return true
    }
    if (this.firstMove && ((this.isWhite && yDiff === -2) || (!this.isWhite && yDiff === 2))) {
      if (this.moveThroughPieces(x, y, board)) {
        return false
      }
      if (!hypothetical) board.flagEnPassant(x, y, this)
      if (this.putsKingInCheck(x, y, board)) {
        return false
      }
      return true
    }
    return false
  }
  hasLegalMoves(board) {
    if (this.taken) return false
    const j = this.isWhite ? -1 : 1
    for (let i = -1; i <= 1; i++) {
      if (this.canMove(this.matrix.x + i, this.matrix.y + j, board)) {
        return true
      }
    }
    return false
  }
}