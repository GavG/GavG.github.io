//Chess.js - GavG

const WIDTH = 8
const HEIGHT = 8
const HTML_BOARD = document.getElementById('board')
var board = 0
var pieces = []

// 7 * * * * * * * *
// 6 * * * * * * * *
// 5 * * * * * * * *
// 4 * * * * * * * *
// 3 * * * * * * * *
// 2 * * * * * * * *
// 1 * * * * * * * *
// 0 * * * * * * * *
//   0 1 2 3 4 5 6 7

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

  set_position_callback() {

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

  set_position_callback() {
    //check captures?
    //check en passant?
    //check queening?
  }

}

function init() {
  reset_board()
  draw_board()
}

function reset_board() {
  board = 0

  for (var i = 0; i < WIDTH; i++) {
    pieces.push(new Pawn(i, 1, true))
    pieces.push(new Pawn(i, HEIGHT - 2, false))
  }
}

function draw_board() {
  for (var i = 0; i < pieces.length; i++) {
    var td = HTML_BOARD.rows[pieces[i].y].cells[pieces[i].x]
    td.classList = []
    td.classList.add(pieces[i].color ? 'w' : 'b')
    td.classList.add(pieces[i].html_class)
  }
}