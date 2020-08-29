const EMPTY = null

export const WHITE = 'w'
export const BLACK = 'b'

export const PAWN = 'p'
export const KNIGHT = 'n'
export const BISHOP = 'b'
export const ROOK = 'r'
export const QUEEN = 'q'
export const KING = 'k'

const PAWN_DELTAS = Object.freeze({
  [BLACK]: [16, 32, 17, 15],
  [WHITE]: [-16, -32, -17, -15]
})
  
const PIECE_DELTAS = Object.freeze({
  [KNIGHT]: [-18, -33, -31, -14, 18, 33, 31, 14],
  [BISHOP]: [-17, -15, 17, 15],
  [ROOK]: [-16, 1, 16, -1],
  [QUEEN]: [-17, -16, -15, 1, 17, 16, 15, -1],
  [KING]: [-17, -16, -15, 1, 17, 16, 15, -1]
})

const PIECE_BITS = Object.freeze({ 
  [PAWN]: 1, 
  [KNIGHT]: 2, 
  [BISHOP]: 4, 
  [ROOK]: 8, 
  [QUEEN]: 16, 
  [KING]: 32 
})

const ATTACKS = Object.freeze([
  20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
   0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
   0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
   0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
   0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
  24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0, 
   0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
   0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
   0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
   0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
   0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0, 
  20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
])

// Gives the "direction" to get from a given square to another
const RAYS = Object.freeze([
  17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
   0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
   0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
   0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
   0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
   0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
   0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
   1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
   0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
   0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
   0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
   0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
   0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
   0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
 -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
])

const SQUARES = Object.freeze({
  a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
  a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
  a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
  a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
  a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
  a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
  a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
  a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
})

const BITS = Object.freeze({
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EN_PASSANT: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64
})

const RANK_1 = 7
const RANK_2 = 6
const RANK_3 = 5
const RANK_4 = 4
const RANK_5 = 3
const RANK_6 = 2
const RANK_7 = 1
const RANK_8 = 0

const ROOKS = Object.freeze({
  [WHITE]: [
    { square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },
    { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE }
  ],
  [BLACK]: [
    { square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },
    { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE }
  ]
})

function getOppositeColor(c) {
  return c === WHITE ? BLACK : WHITE
}

function rank(i) {
  return i >> 4 // gets the first hex digit
}

function file(i) {
  return i & 0x0f // gets the last hex digit
}

function algebraic (i) {
  const r = 8 - rank(i)
  const f = 'abcdefgh'.charAt(file(i))
  return `${f}${r}`
}
export class Chess {

  constructor() {
    this.board = new Array(128).fill(EMPTY)
    this.kings = { [WHITE]: EMPTY, [BLACK]: EMPTY }
    this.currentTurn = WHITE
    this.castling = { [WHITE]: 96, [BLACK]: 96 }
    this.enPassantSquare = EMPTY
    this.initalize()
  }
  initalize() {
    const setupPieces = (color) => {
      const pieceStart = color === WHITE ? SQUARES.a1 : SQUARES.a8
      const pawnStart =  color === WHITE ? SQUARES.a2 : SQUARES.a7
      const pieceTypes = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK]

      for (let i = 0; i < 8; i++) {
        if (i === 4) {
          this.kings[color] = pieceStart + i
        }
        this.board[pieceStart + i] = { type: pieceTypes[i], color }
        this.board[pawnStart + i] = { type: PAWN, color }
      }
    }

    setupPieces(WHITE)
    setupPieces(BLACK)
  }

  isSquareAttacked(attackingColor, targetSquare) {
    for (let currentSquare = SQUARES.a8; currentSquare <= SQUARES.h1; currentSquare++) {
      if (currentSquare & 0x88) {
        currentSquare += 7
        continue
      }

      if (this.board[currentSquare] == EMPTY || this.board[currentSquare].color !== attackingColor) {
        // no enemy piece on this square, skip it
        continue
      }
      const piece = this.board[currentSquare]
      const difference = currentSquare - targetSquare
      const index = difference + 0x77
      
      if (ATTACKS[index] & PIECE_BITS[piece.type]) {
        if (piece.type === KNIGHT || piece.type === KING) return true
        if (piece.type === PAWN) {
          if ((difference > 0 && piece.color === WHITE) || (difference < 0 && piece.color === BLACK)) return true
          continue
        }
        // Else its a sliding piece, Q, B, R
        const offset = RAYS[index]
        let nextSquare = currentSquare + offset // next square in that direction
        // check if any pieces are blocking the attack
        let blocked = false
        while (nextSquare !== targetSquare) {
          if (this.board[nextSquare] != EMPTY) {
            blocked = true
            break
          }
          nextSquare += offset
        }

        if (!blocked) return true
      }
    }
    return false
  }

  isKingInCheck(color) {
    return this.isSquareAttacked(getOppositeColor(color), this.kings[color])
  }

  makeMove(move, callback) {
    let oldCastling, oldKings, oldEnPassantSquare
    const currentColor = this.currentTurn
    const enemyColor = getOppositeColor(currentColor)
    if (typeof callback === 'function') {
      oldCastling = Object.assign({}, this.castling)
      oldKings = Object.assign({}, this.kings)
      oldEnPassantSquare = this.enPassantSquare
    }

    this.board[move.to] = this.board[move.from]
    this.board[move.from] = EMPTY

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (currentColor === BLACK) {
        this.board[move.to - 16] = EMPTY
      } else {
        this.board[move.to + 16] = EMPTY
      }
    }

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      this.board[move.to] = { type: move.promotion, color: currentColor }
    }

    /* if we moved the king */
    if (this.board[move.to].type === KING) {
      this.kings[this.board[move.to].color] = move.to

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        const castling_to = move.to - 1
        const castling_from = move.to + 1
        this.board[castling_to] = this.board[castling_from]
        this.board[castling_from] = EMPTY
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        const castling_to = move.to + 1
        const castling_from = move.to - 2
        this.board[castling_to] = this.board[castling_from]
        this.board[castling_from] = EMPTY
      }

      /* turn off castling */
      this.castling[currentColor] = 0
    }

    /* turn off castling if we move a rook */
    if (this.castling[currentColor]) {
      for (const rook of ROOKS[currentColor]) {
        if (
          move.from === rook.square &&
          this.castling[currentColor] & rook.flag
        ) {
          this.castling[currentColor] ^= rook.flag
          break
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (this.castling[enemyColor]) {
      for (const rook of ROOKS[currentColor]) {
        if (
          move.to === rook.square &&
          this.castling[enemyColor] & rook.flag
        ) {
          this.castling[enemyColor] ^= rook.flag
          break
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      this.enPassantSquare = currentColor === BLACK ? move.to - 16 : move.to + 16
    } else {
      this.enPassantSquare = EMPTY
    }
    this.currentTurn = enemyColor

    if (typeof callback === 'function') {
      callback()
      this.currentTurn = currentColor
      this.kings = oldKings
      this.enPassantSquare = oldEnPassantSquare
      this.castling = oldCastling

      this.board[move.from] = this.board[move.to]
      this.board[move.from].type = move.piece
      this.board[move.to] = EMPTY

      if (move.flags & BITS.CAPTURE) {
        this.board[move.to] = { type: move.captured, color: enemyColor }
      } else if (move.flags & BITS.EN_PASSANT ) {
        this.board[move.to + (currentColor === WHITE) ? 16 : -16] = { type: PAWN, color: enemyColor}
      }
      if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
        const castlingTo = (move.flags & BITS.KSIDE_CASTLE) ? move.to + 1 : move.to - 2
        const castlingFrom = (move.flags & BITS.KSIDE_CASTLE) ? move.to - 1 : move.to + 1
        this.board[castlingTo] = this.board[castlingFrom]
        this.board[castlingFrom] = EMPTY
        
      }
    }

  }

  buildMove(from, to, flags, promotion) {
    const move = {
      color: this.currentTurn,
      from: from,
      to: to,
      flags: flags,
      piece: this.board[from].type
    }

    if (promotion) {
      move.flags |= BITS.PROMOTION
      move.promotion = promotion
    }

    if (this.board[to]) {
      move.captured = this.board[to].type
    } else if (flags & BITS.EP_CAPTURE) {
      move.captured = PAWN
    }
    return move
  }
  generateMoves(options) {
    const addMove = (moves, from, to, flags) => {
      /* if pawn promotion */
      if (
        this.board[from].type === PAWN &&
        (rank(to) === RANK_8 || rank(to) === RANK_1)
      ) {
        const pieces = [QUEEN, ROOK, BISHOP, KNIGHT]
        pieces.forEach(piece => {
          moves.push(this.buildMove(from, to, flags, piece))
        })
      } else {
        moves.push(this.buildMove(from, to, flags))
      }
    }

    const moves = []
    const currentColor = this.currentTurn
    const enemyColor = getOppositeColor(currentColor)
    const secondRank = { [BLACK]: RANK_7, [WHITE]: RANK_2 }

    let firstSquare = SQUARES.a8
    let lastSquare= SQUARES.h1
    let singleSquare = false

    if (options && 'square' in options) {
      if (options.square in SQUARES) {
        firstSquare = lastSquare = SQUARES[options.square]
        singleSquare = true
      } else {
        /* invalid square */
        return []
      }
    }

    for (let currentSquare = firstSquare; currentSquare <= lastSquare; currentSquare++) {
      /* did we run off the end of the board */
      if (currentSquare & 0x88) {
        currentSquare += 7
        continue
      }

      const piece = this.board[currentSquare]
      if (piece == null || piece.color !== currentColor) {
        continue
      }

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        let targetSquare = currentSquare + PAWN_DELTAS[currentColor][0]
        if (this.board[targetSquare] == null) {
          addMove(moves, currentSquare, targetSquare, BITS.NORMAL)

          /* double square */
          targetSquare = currentSquare + PAWN_DELTAS[currentColor][1]
          if (secondRank[currentColor] === rank(currentSquare) && this.board[targetSquare] == null) {
            addMove(moves, currentSquare, targetSquare, BITS.BIG_PAWN)
          }
        }

        /* pawn captures */
        for (let j = 2; j < 4; j++) {
          targetSquare = currentSquare + PAWN_DELTAS[currentColor][j]
          if (targetSquare & 0x88) continue

          if (this.board[targetSquare] != EMPTY && this.board[targetSquare].color === enemyColor) {
            addMove(moves, currentSquare, targetSquare, BITS.CAPTURE)
          } else if (targetSquare === this.enPassantSquare) {
            addMove(moves, currentSquare, this.enPassantSquare, BITS.EP_CAPTURE)
          }
        }
      } else {
        PIECE_DELTAS[piece.type].forEach(offset => {
          let targetSquare = currentSquare

          while (true) {
            targetSquare += offset
            if (targetSquare & 0x88) break

            if (this.board[targetSquare] == EMPTY) {
              addMove(moves, currentSquare, targetSquare, BITS.NORMAL)
            } else {
              if (this.board[targetSquare].color === currentColor) break
              addMove(moves, currentSquare, targetSquare, BITS.CAPTURE)
              break
            }

            /* break, if knight or king */
            if (piece.type === KNIGHT || piece.type === KING) break
          }
        })
      }
    }


    if (!singleSquare || lastSquare === this.kings[currentColor]) {
      /* king-side castling */
      if (this.castling[currentColor] & BITS.KSIDE_CASTLE) {
        const castling_from = this.kings[currentColor]
        const castling_to = castling_from + 2

        if (
          this.board[castling_from + 1] == null &&
          this.board[castling_to] == null &&
          !this.isSquareAttacked(enemyColor, castling_from) &&
          !this.isSquareAttacked(enemyColor, castling_from + 1) &&
          !this.isSquareAttacked(enemyColor, castling_to)
        ) {
          addMove(moves, this.kings[currentColor], castling_to, BITS.KSIDE_CASTLE)
        }
      }

      /* queen-side castling */
      if (this.castling[currentColor] & BITS.QSIDE_CASTLE) {
        const castling_from = this.kings[currentColor]
        const castling_to = castling_from - 2

        if (
          this.board[castling_from - 1] == null &&
          this.board[castling_from - 2] == null &&
          this.board[castling_from - 3] == null &&
          !this.isSquareAttacked(enemyColor, this.kings[currentColor]) &&
          !this.isSquareAttacked(enemyColor, castling_from - 1) &&
          !this.isSquareAttacked(enemyColor, castling_to)
        ) {
          addMove(moves, this.kings[currentColor], castling_to, BITS.QSIDE_CASTLE)
        }
      }
    }

    /* filter out illegal moves */
    const legalMoves = []
    moves.forEach(move => {
      this.makeMove(move, () => {
        if (!this.isKingInCheck(currentColor))
          legalMoves.push(move)
      })
    })

    return legalMoves
  }
  move(move) {
    function toNumber(m) {
      if (typeof move.from === 'number' && typeof move.to === 'number') return m;

      const result = { ... m }
      result.from = SQUARES[m.from]
      result.to = SQUARES[m.to]
      return result
    }
    const selectedMove = toNumber(move)

    const legalMoves = this.generateMoves({ square: algebraic(selectedMove.from) })
    let move_obj
    for (const currentMove of legalMoves) {
      if (
        selectedMove.from === currentMove.from &&
        selectedMove.to === currentMove.to &&
        (!currentMove.promotion ||
          selectedMove.promotion === currentMove.promotion)
      ) {
        move_obj = currentMove
        break
      }
    }
    if (move_obj) {
      this.makeMove(move_obj)
    }
  }
  isGameOver() {
    return this.generateMoves().length === 0
  }
  generateBoard() {
    const output = []
    let row = []
    for (let i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (this.board[i] == EMPTY) {
        row.push(EMPTY)
      } else {
        row.push({ type: this.board[i].type, color: this.board[i].color })
      }
      if ((i + 1) & 0x88) {
        output.push(row)
        row = []
        i += 8
      }
    }
    return output
  }
  getPieceAt(square) {
    if (square in SQUARES) {
      return this.board[SQUARES[square]]
    }
    return null
  }
}