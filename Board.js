class Board {
  constructor() {
    this.whitePieces = []
    this.blackPieces = []
    this.score = 0
    this.matrix = []
    this.setupMatrix()
    this.setupPieces(true)
    this.setupPieces(false)
    this.enPassant = false
  }
  setupMatrix() {
    this.matrix = new Array(8)
    for (let i = 0; i < 8; i++) {
      this.matrix[i] = new Array(8)
      for (let j = 0; j < 8; j++) {
        this.matrix[i][j] = null
      }
    }
  }
  setupPieces(isWhite) {
    const pieces = isWhite ? this.whitePieces : this.blackPieces
    const rank = isWhite ? 7 : 0
    const pawnRank = isWhite ? 6 : 1
    const pieceTypes = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook]
    pieceTypes.forEach((Piece, file) => {
      const piece = new Piece(file, rank, isWhite)
      pieces.push(piece)
      this.matrix[file][rank] = piece
    })
    for (let file = 0; file < 8; file++) {
      const pawn = new Pawn(file, pawnRank, isWhite)
      pieces.push(pawn)
      this.matrix[file][pawnRank] = pawn
    }
  }

  show() {
    this.whitePieces.forEach(piece => {
      piece.show()
    })
    this.blackPieces.forEach(piece => {
      piece.show()
    })
  }
  getPieceAt(x, y) {
    if (x >= 0 && y >=0 && x < 8 && y < 8) {
      return this.matrix[x][y]
    }
    return null
  } 

  kingIsInCheck(isWhite) {
    const king = isWhite ? this.whitePieces[4] : this.blackPieces[4]
    return king.isInCheck(king.matrix.x, king.matrix.y, this)
  }
  canPieceGoHere(x, y, allyPieces) {
    for (let i = 0; i < allyPieces.length; i++ ) {
      if (i !== 4 && allyPieces[i].canMove(x, y, this)) {
        return true
      }
    }
    return false
  }
  getEnemyKing(isWhite) {
    return isWhite ? this.blackPieces[4] : this.whitePieces[4]
  }
  canCastle(x, y, king) {
    if (king.isInCheck(king.matrix.x, king.matrix.y, this).length > 0) return false
    const xDiff = x - king.matrix.x
    const yDiff = y - king.matrix.y
    if (yDiff !== 0) return false
    const allyPieces = king.isWhite ? this.whitePieces : this.blackPieces
    const rook = (xDiff < 0) ? allyPieces[0] : allyPieces[7]
    if (!rook.firstMove) return false
    const stepX = (xDiff < 0) ? -1 : 1
    for (let i = king.matrix.x + stepX, j = 0; j < 2 ; i += stepX, j++) {
      if (this.getPieceAt(i, y)) {
        return false
      }
      if (king.isInCheck(i, y, this).length > 0) {
        return false
      }
    }
    return { rook, stepX }
  }
  flagEnPassant(x, y, pawn) {
    const enemyPieces = pawn.isWhite ? this.blackPieces : this.whitePieces
    const capturingPawns = []
    for (let i = 8; i < enemyPieces.length; i++) {
      if (!enemyPieces[i].taken && enemyPieces[i].matrix.y === y && Math.abs(enemyPieces[i].matrix.x - x) === 1) {
        capturingPawns.push(enemyPieces[i])
      }
    }
    if (capturingPawns.length > 0) {
      this.enPassant = { pawn, capturingPawns }
    }
  }
  isGameOver(isWhite) {
    const enemyPieces = isWhite ? this.blackPieces : this.whitePieces
    const enemyKing = enemyPieces[4]
    const checkingPieces = enemyKing.isInCheck(enemyKing.matrix.x, enemyKing.matrix.y, this)
    if (enemyKing.hasLegalMoves(this)) {
      // King still has legal moves
      return 0
    } else {
      // King has no legal moves
      if (checkingPieces.length > 0) {
        if (checkingPieces.length === 2) {
          // double check
          // checkmate
          return 1
        } else {
          const checkingPiece = checkingPieces[0]
          // only one checking piece i.e. checkingPieces.length === 1
          // check if checkingPiece can be captured
          if (this.canPieceGoHere(checkingPiece.matrix.x, checkingPiece.matrix.y, enemyPieces)) {
            return 0
          }
          // Check if check can be blocked
          if (checkingPiece.letter === 'N' || checkingPiece.letter === 'P') {
            return 1 //checkmate
          }
          const xDiff = checkingPiece.matrix.x - enemyKing.matrix.x
          const yDiff = checkingPiece.matrix.y - enemyKing.matrix.y
          const stepX = (xDiff === 0) ? 0 : (xDiff > 0 ) ? 1 : -1
          const stepY = (yDiff === 0) ? 0 : (yDiff > 0 ) ? 1 : -1
          for (let i = stepX, j = stepY; !(i === xDiff && j === yDiff); i += stepX, j += stepY) {
            if (this.canPieceGoHere(enemyKing.matrix.x, enemyKing.matrix.y + i, enemyPieces)) {
              // not checkmate
              return 0
            }
          }
          // Cannot be blocked and cannot be captured, so checkmate
          return 1
        }
        // Is double check?
          // If yes, then Checkmate as king has no legal moves
          // else 
          // If attacking piece can be captured then not checkmate
          // else if check can be blocked then not checkmate
      } else {
        // Stalemate
        for (let i = 0; i < enemyPieces.length; i++) {
          if (i !== 4 && enemyPieces[i].hasLegalMoves(this)) {
            // Game not over
            return 0
          }
        }
        return -1
      }
    }
  }
} 
