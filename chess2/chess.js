//Chess.js - GavG

const WIDTH = 8
const HEIGHT = 8
const WHITE = true
const BLACK = false
const SELECTED_CLASS = 'h'
const SELECTING_CLASS = 's'
const WHITE_CLASS = 'w'
const BLACK_CLASS = 'b'
const ELEMENT_DIMENSION = 12
const HI32 = 0x80000000
const LOW32 = 0x7fffffff

var HTML_BOARD = null
var board = 0
var white_pieces = []
var black_pieces = []
var selected_element = null
var selected_piece = null
var initialised = 0

class Bitboard {

  constructor(h, w, _x = null, _y = null) {
    this.height = h
    this.width = w
    this.value = 0
    if (_x !== null && _y !== null) this.set_position(_x, _y)
  }

  set_position(_x, _y) {
    if (_x <= this.width && _y <= this.height) {
      this.x = _x
      this.y = _y
      this.value = left_shift(Math.pow(2, _x), (_y * this.width))
      console.log(this.value)
    }
  }

  add_position(_x, _y) {
    if (_x <= this.width && _y <= this.height) {
      this.value = or_64(this.value, left_shift(Math.pow(2, _x), _y * this.width))
    }
  }

  visual() {
    var bit_string = this.value.toString(2);
    while (bit_string.length < this.width * this.height) {
      bit_string = "0" + bit_string
    }
    return bit_string.replace(new RegExp("(.{" + this.width + "})", "g"), "$1\n")
  }
}

class Piece {

  constructor(html_class, _x, _y, color) {
    this.html_class = String(html_class)
    this.x = _x
    this.y = _y
    this.color = !!color
    this.position_board = new Bitboard(WIDTH, HEIGHT, _x, _y)
    this.attacking_board = new Bitboard(WIDTH, HEIGHT)
    this.html_element = null
  }

  draw() {
    var self = this
    if (!this.html_element) {
      this.html_element = document.createElement("div")
      HTML_BOARD.appendChild(self.html_element)
      this.html_element.addEventListener('mousedown', function() {
        piece_selected(this, self)
      })
    }
    this.html_element.classList = []
    this.html_element.classList.add('piece')
    this.html_element.classList.add(self.color ? WHITE_CLASS : BLACK_CLASS)
    this.html_element.classList.add(self.html_class)

    this.update_html_position()
    this.update_attacking_board()
  }

  update_html_position() {
    if (this.x_class || this.y_class) {
      this.html_element.classList.remove(this.x_class)
      this.html_element.classList.remove(this.y_class)
    }
    this.x_class = 'x' + this.x
    this.y_class = 'y' + this.y
    this.html_element.classList.add(this.x_class)
    this.html_element.classList.add(this.y_class)
  }

  update_attacking_board() {}

  move_to(_x, _y) {
    this.x = _x
    this.y = _y
    this.position_board.set_position(_x, _y)
    this.update_html_position()
    this.update_attacking_board()
  }
}

class Pawn extends Piece {
  constructor(x, y, color) {
    super('P', x, y, color)
    this.first_move = true
  }

  update_attacking_board() {
    this.attacking_board.set_position(this.x, this.y + 1)
    if (this.first_move) {
      this.attacking_board.add_position(this.x, this.y + 2)
      this.first_move = false
    }
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
    HTML_BOARD = document.getElementById('board')
    board = 0
    draw_cells()
    HTML_BOARD.addEventListener('click', cell_selected)
    create_pieces()
    initialised = true
  }
  draw_pieces()
}

function create_pieces() {

  white_pieces = [
    new Rook(0, 0, WHITE),
    new Knight(1, 0, WHITE),
    new Bishop(2, 0, WHITE),
    new Queen(3, 0, WHITE),
    new King(4, 0, WHITE),
    new Bishop(5, 0, WHITE),
    new Knight(6, 0, WHITE),
    new Rook(7, 0, WHITE),
  ]

  black_pieces = [
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
    white_pieces.push(new Pawn(i, 1, WHITE))
    black_pieces.push(new Pawn(i, HEIGHT - 2, BLACK))
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
  for (var i = 0; i < white_pieces.length; i++) {
    white_pieces[i].draw()
  }
  for (var i = 0; i < black_pieces.length; i++) {
    black_pieces[i].draw()
  }
}

function piece_selected(element, piece) {
  element.classList.add(SELECTED_CLASS)

  console.log(piece.position_board.visual())

  if (selected_element) {
    selected_element.classList.remove(SELECTED_CLASS)
  }
  selected_element = element
  selected_piece = piece
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

function left_shift(num, bits) {
  return num * Math.pow(2, bits);
}

function or_64(v1, v2) {
  var hi = 0x80000000;
  var low = 0x7fffffff;
  var hi1 = ~~(v1 / hi);
  var hi2 = ~~(v2 / hi);
  var low1 = v1 & low;
  var low2 = v2 & low;
  var h = hi1 | hi2;
  var l = low1 | low2;
  return h * hi + l;
}

function BitwiseAndLarge(val1, val2) {
  var shift = 0,
    result = 0;
  var mask = ~((~0) << 30); // Gives us a bit mask like 01111..1 (30 ones)
  var divisor = 1 << 30; // To work with the bit mask, we need to clear bits at a time
  while ((val1 != 0) && (val2 != 0)) {
    var rs = (mask & val1) & (mask & val2);
    val1 = Math.floor(val1 / divisor); // val1 >>> 30
    val2 = Math.floor(val2 / divisor); // val2 >>> 30
    for (var i = shift++; i--;) {
      rs *= divisor; // rs << 30
    }
    result += rs;
  }
  return result;
}

init();