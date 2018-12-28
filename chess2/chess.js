//Chess.js - GavG

const WIDTH = 8
const HEIGHT = 8
const WHITE = true
const BLACK = false
const HTML_BOARD = document.getElementById('board')
const SELECTED_CLASS = 'h'
const SELECTING_CLASS = 's'
const WHITE_CLASS = 'w'
const BLACK_CLASS = 'b'
const ELEMENT_DIMENSION = 12

var board = 0
var pieces = []
var selected_element = null
var selected_piece = null
var initialised = 0

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
    if (_x <= this.width && _y <= this.height) {
      this.x = _x
      this.y = _y
      this.position_board = (_y * WIDTH) + _x + 1
    }
  }
}

class Piece extends Bitboard {

  constructor(html_class, x, y, color) {
    super(WIDTH, HEIGHT, x, y)
    this.color = !!color
    this.html_class = String(html_class)
    this.html_element = null
  }

  draw() {
    var self = this
    if (!self.html_element) {
      this.html_element = document.createElement("div")
      HTML_BOARD.appendChild(self.html_element)
      self.html_element.addEventListener('click', function(event) {
        event.stopPropagation()
        piece_selected(this, self)
      }, true)
    }
    self.html_element.classList = []
    self.html_element.classList.add('piece')
    self.html_element.classList.add(self.color ? WHITE_CLASS : BLACK_CLASS)
    self.html_element.classList.add(self.html_class)

    self.update_html_position()
  }

  update_html_position() {
    this.html_element.style.bottom = (this.y * ELEMENT_DIMENSION) + 'vh'
    this.html_element.style.left = (this.x * ELEMENT_DIMENSION) + 'vh'
  }

  move_to(x, y) {
    this.set_position(x, y)
    this.update_html_position()
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
  if (!initialised) {
    board = 0
    draw_cells()
    HTML_BOARD.addEventListener('click', cell_selected)
    create_pieces()
    initialised = true
  }
  draw_pieces()
}

function create_pieces() {

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

function draw_cells() {
  for (var y = HEIGHT - 1; y >= 0; y--) {
    var html_row = document.createElement("div")
    html_row.classList.add("row")

    for (var x = 0; x < WIDTH; x++) {
      var html_cell = document.createElement("div")
      html_cell.classList.add('cell')
      html_cell.dataset.y = y
      html_cell.dataset.x = x
      html_row.appendChild(html_cell)
    }

    HTML_BOARD.appendChild(html_row)
  }
}

function draw_pieces() {
  for (var i = 0; i < pieces.length; i++) {
    pieces[i].draw()
  }
}

function piece_selected(element, piece) {
  if (selected_element) {
    selected_element.classList.remove(SELECTED_CLASS)
  }
  selected_element = element
  selected_piece = piece
  selected_element.classList.add(SELECTED_CLASS)
  HTML_BOARD.classList.add(SELECTING_CLASS)
}

function cell_selected(event) {
  var cell = event.target
  if (selected_element && cell.dataset.x >= 0 && cell.dataset.y >= 0) {

    selected_piece.move_to(cell.dataset.x, cell.dataset.y)

    //move if viable
    selected_element.classList.remove(SELECTED_CLASS)
    HTML_BOARD.classList.remove(SELECTING_CLASS)
    selected_element = null
    selected_piece = null
  }
}

init();