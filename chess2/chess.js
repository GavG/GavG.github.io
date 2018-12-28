//Chess.js - GavG

const WIDTH = 8
const HEIGHT = 8
const HTML_BOARD = document.getElementById('board')
const WHITE = true
const BLACK = false

var board = 0
var pieces = []

class Bitboard {

  constructor(h, w, _x, _y) {
    this.height = h
    this.width = w
    this.x = _x
    this.y = _y
    this.position_board = 0
    this.attacking_board = 0
  }

  set_position(_x, _y) {
    if (x <= this.width && y <= this.height) {
      this.x = _x
      this.y = _y
      this.position_board = (y * WIDTH) + x + 1
      this.set_position_callback()
    }
  }
  // set_attacking() {
  //
  // }
}

class Piece extends Bitboard {

  constructor(html_class, x, y, color) {
    super(WIDTH, HEIGHT, x, y)
    this.color = !!color
    this.html_class = String(html_class)
  }

}

class Pawn extends Piece {
  constructor(x, y, color) {
    super('P', x, y, color)
    this.first_move = false
  }
}

class Rook extends Piece {
  constructor(x, y, color) {
    super('R', x, y, color)
  }
}

class Knight extends Piece {
  constructor(x, y, color) {
    super('N', x, y, color)
  }
}

class Bishop extends Piece {
  constructor(x, y, color) {
    super('B', x, y, color)
  }
}

class King extends Piece {
  constructor(x, y, color) {
    super('K', x, y, color)
  }
}

class Queen extends Piece {
  constructor(x, y, color) {
    super('Q', x, y, color)
  }
}

function init() {
  reset_board()
  draw_board()
}

function reset_board() {
  board = 0

  pieces = [
    new Rook(0, 0, WHITE),
    new Knight(1, 0, WHITE),
    new Bishop(2, 0, WHITE),
    new Queen(3, 0, WHITE),
    new King(4, 0, WHITE),
    new Bishop(5, 0, WHITE),
    new Knight(6, 0, WHITE),
    new Rook(7, 0, WHITE),
    new Rook(0, HEIGHT - 1, BLACK),
    new Knight(1, HEIGHT - 1, BLACK),
    new Bishop(2, HEIGHT - 1, BLACK),
    new Queen(3, HEIGHT - 1, BLACK),
    new King(4, HEIGHT - 1, BLACK),
    new Bishop(5, HEIGHT - 1, BLACK),
    new Knight(6, HEIGHT - 1, BLACK),
    new Rook(7, HEIGHT - 1, BLACK),
  ]

  for (var i = 0; i < WIDTH; i++) {
    pieces.push(new Pawn(i, 1, WHITE))
    pieces.push(new Pawn(i, HEIGHT - 2, BLACK))
  }
}

function draw_board() {
  for (var i = 0; i < pieces.length; i++) {
    var td = HTML_BOARD.rows[HEIGHT - pieces[i].y - 1].cells[pieces[i].x]
    td.classList = []
    td.classList.add(pieces[i].color ? 'w' : 'b')
    td.classList.add(pieces[i].html_class)
  }
}

init();