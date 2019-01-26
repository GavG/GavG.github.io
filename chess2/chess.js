//Chess.js - GavG

const WIDTH = 8
const HEIGHT = 8
const WHITE = true
const BLACK = false
const SELECTED_CLASS = 's'
const SELECTING_CLASS = 'selecting'
const HIGHLIGHTED_CLASS = 'h'
const WHITE_CLASS = 'w'
const BLACK_CLASS = 'b'
const ELEMENT_DIMENSION = 12
const WORD_32 = 4294967296; // 2^32

var HTML_BOARD = null
var board = 0
var white_pieces = []
var black_pieces = []
var highlighted_cells = []
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
    if (_x <= this.width && _x >= 0 && _y <= this.height && _y >= 0) {
      this.x = parseInt(_x)
      this.y = parseInt(_y)
      this.value = left_shift(Math.pow(2, _x), (_y * this.width))
    }
  }

  add_position(_x, _y) {
    if (_x <= this.width && _y <= this.height) {
      var temp_board = new Bitboard(WIDTH, HEIGHT)
      temp_board.value = left_shift(Math.pow(2, _x), _y * this.width)
      this.or_64(temp_board, true)
    }
  }

  coordinates() {
    var coordinates = []
    var string = this.value.toString(2)
    var len = string.length - 1
    for (var i = len; i >= 0; i--) {
      var pos = len - i
      if (string[i] > 0) {
        coordinates.push([pos % this.width, Math.floor(pos / this.width)])
      }
    }
    return coordinates
  }

  visual() {
    var bit_string = this.value.toString(2);
    while (bit_string.length < this.width * this.height) {
      bit_string = "0" + bit_string
    }
    return bit_string.replace(new RegExp("(.{" + this.width + "})", "g"), function(match) {
      return match.split("").reverse().join("") + "\n"
    })
  }

  xor_64(other_board, update = false) {
    var result_board = xor_64(this.value, other_board.value)
    if (update) {
      this.value = result_board.value
    } else {
      return result_board
    }
  }

  or_64(other_board, update = false) {
    var result_board = or_64(this.value, other_board.value)
    if (update) {
      this.value = result_board.value
    } else {
      return result_board
    }
  }
}

class Piece {

  constructor(html_class, _x, _y, color) {
    this.html_class = String(html_class)
    this.set_x(_x)
    this.set_y(_y)
    this.color = !!color
    this.position_board = new Bitboard(WIDTH, HEIGHT, this.x, this.y)
    this.attacking_board = new Bitboard(WIDTH, HEIGHT)
    this.html_element = null
  }

  draw() {
    var self = this
    if (!this.html_element) {
      this.html_element = document.createElement("div")
      HTML_BOARD.appendChild(self.html_element)
      this.html_element.addEventListener('click', function(event) {
        event.stopPropagation()
        piece_selected(this, self)
      })
    }
    this.html_element.classList = []
    this.html_element.classList.add('piece')
    this.html_element.classList.add(self.color ? WHITE_CLASS : BLACK_CLASS)
    this.html_element.classList.add(self.html_class)

    this.update_html_position()
    this.update_attacking_board() //call here as all pieces generated
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

  update_attacking_board() {
    //overide in subclass
  }

  move_to_callback() {
    //overide in subclass
  }

  set_x(_x) {
    this.x = parseInt(_x)
  }

  set_y(_y) {
    this.y = parseInt(_y)
  }

  move_to(_x, _y) {
    this.set_x(_x)
    this.set_y(_y)
    this.position_board.set_position(this.x, this.y)
    this.update_html_position()
    this.update_attacking_board()
    this.move_to_callback()
  }

  viable_positions_board() {
    this.update_attacking_board()
    var this_player_board = player_board(this.color)

    console.log(this.attacking_board.value)
    console.log(this_player_board.value)
    console.log(this.attacking_board.or_64(this_player_board).visual())

    return this.attacking_board.or_64(this_player_board).xor_64(this_player_board)
  }
}

class Pawn extends Piece {
  constructor(x, y, color) {
    super('P', x, y, color)
    this.first_move = true
  }

  update_attacking_board() {
    var direction = this.color ? 1 : -1
    this.attacking_board.set_position(this.x, this.y + direction)
    if (this.first_move) {
      this.attacking_board.add_position(this.x, this.y + (direction * 2))
    }
    console.log(this.attacking_board)
  }

  move_to_callback() {
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

function highlight_cells(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    var cell = get_cell(coordinates[i][0], coordinates[i][1])
    highlighted_cells.push(cell)
    cell.classList.add(HIGHLIGHTED_CLASS)
  }
}

function clear_highlighted_cells() {
  for (var i = 0; i < highlighted_cells.length; i++) {
    highlighted_cells[i].classList.remove(HIGHLIGHTED_CLASS)
  }
  highlighted_cells = []
}

function get_cell(x, y) {
  return HTML_BOARD.querySelector("[data-x='" + x + "'][data-y='" + y + "']")
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

  var viable_positions_board = piece.viable_positions_board()

  highlight_cells(viable_positions_board.coordinates())

  if (selected_element) {
    selected_element.classList.remove(SELECTED_CLASS)
  }
  selected_element = element
  selected_piece = piece
  HTML_BOARD.classList.add(SELECTING_CLASS)
}

function cell_selected(event) {
  clear_highlighted_cells()
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

function player_board(color) {
  pieces = color ? white_pieces : black_pieces
  var position_board = new Bitboard(WIDTH, HEIGHT)
  for (var i = 0; i < pieces.length; i++) {
    position_board.or_64(pieces[i].position_board, true)
  }
  return position_board
}

function left_shift(num, bits) {
  return num * Math.pow(2, bits);
}

function or_64(a, b) {
  var aHI = a / WORD_32
  var bHI = b / WORD_32

  var aLO = a % WORD_32;
  var bLO = b % WORD_32;

  var value = ((aHI | bHI) * WORD_32) + (aLO | bLO)

  var result_board = new Bitboard(WIDTH, HEIGHT)
  result_board.value = value

  return result_board
}

function xor_64(a, b) {
  var aHI = a / WORD_32
  var bHI = b / WORD_32

  var aLO = a % WORD_32;
  var bLO = b % WORD_32;

  var value = ((aHI ^ bHI) * WORD_32) + (aLO ^ bLO)

  var result_board = new Bitboard(WIDTH, HEIGHT)
  result_board.value = value
  return result_board
}

init();