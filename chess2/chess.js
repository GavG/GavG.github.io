//Chess.js - GavG

const WIDTH = 8
const HEIGHT = 8
const WHITE = true
const BLACK = false
const SELECTED_CLASS = 's'
const SELECTING_CLASS = 'x'
const HIGHLIGHTED_CLASS = 'h'
const WHITE_CLASS = 'w'
const BLACK_CLASS = 'b'
const PIECE_CLASS = 'piece'
const DEAD_CLASS = 'dead'

var HTML_BOARD = null
var board = 0
let turn = WHITE
var white_pieces = []
var black_pieces = []
var highlighted_cells = []
var selected_element = null
var selected_piece = null
var initialised = 0

var captured = {
  [WHITE_CLASS]: [],
  [BLACK_CLASS]: []
}

var cached_player_boards = {
  [WHITE_CLASS]: null,
  [BLACK_CLASS]: null
}

var moved = {
  [WHITE_CLASS]: false,
  [BLACK_CLASS]: false
}

class Bitboard {

  constructor(h, w, _x = null, _y = null, value = 0) {
    this.height = h
    this.width = w
    this.value = value
    if (_x !== null && _y !== null) {
      this.set_position(_x, _y)
    } else {
      this.set_value(value)
    }
  }

  set_value(value) {
    this.value = typeof value === 'bigint' ? value : BigInt(value)
  }

  set_position(_x, _y) {
    if (_x <= this.width && _x >= 0 && _y <= this.height && _y >= 0)
      this.set_value(shift(Math.pow(2, _x), (_y * this.width)))
  }

  add_position(_x, _y) {
    if (_x <= this.width && _y <= this.height && _x >= 0 && _y >= 0) {
      var temp_board = new Bitboard(WIDTH, HEIGHT)
      temp_board.set_value(shift(Math.pow(2, _x), _y * this.width))
      this.or(temp_board, true)
    }
  }

  check_position(_x, _y) {
    //TODO prevent King capturing, best to just do an AND with the opponents King position board
    let temp_board = new Bitboard(WIDTH, HEIGHT)
    if (_x <= this.width && _y <= this.height && _x >= 0 && _y >= 0) {
      temp_board.set_value(shift(Math.pow(2, _x), _y * this.width))
      return this.and(temp_board, false)
    }
    return temp_board
  }

  coordinates() {
    let coordinates = []
    let string = this.value.toString(2)
    let len = string.length - 1
    for (let i = len; i >= 0; i--) {
      let pos = len - i
      if (string[i] > 0) coordinates.push([pos % this.width, Math.floor(pos / this.width)])
    }
    return coordinates
  }

  visual() {
    var bit_string = this.value.toString(2);
    while (bit_string.length < this.width * this.height) {
      bit_string = "0" + bit_string
    }
    return bit_string.replace(new RegExp("(.{" + this.width + "})", "g"), (match) => {
      return match.split("").reverse().join("") + "\n"
    })
  }

  or(other_board, update = false) {
    let result_board = new Bitboard(WIDTH, HEIGHT, null, null, this.value | other_board.value)
    if (update) this.value = result_board.value
    return result_board
  }

  and(other_board, update = false) {
    let result_board = new Bitboard(WIDTH, HEIGHT, null, null, this.value & other_board.value)
    if (update) this.value = result_board.value
    return result_board
  }
}

class Piece {

  constructor(_x, _y, color) {
    this.original_x = _x
    this.original_y = _y
    this.set_x(_x)
    this.set_y(_y)
    this.color = !!color
    this.direction = this.color ? 1 : -1
    this.position_board = new Bitboard(WIDTH, HEIGHT, this.x, this.y)
    this.attacking_board = new Bitboard(WIDTH, HEIGHT)
    this.html_element = null
  }

  draw(extra_classes = []) {
    var self = this
    if (!this.html_element) {
      this.html_element = document.createElement("div")
      HTML_BOARD.appendChild(self.html_element)
      this.html_element.addEventListener('click', function(event) {
        event.stopPropagation()
        piece_selected(this, self)
      })
    }
    this.html_element.classList.add(PIECE_CLASS, self.html_class, self.color ? WHITE_CLASS : BLACK_CLASS, ...extra_classes)
    this.update_html_position()
  }

  update_html_position() {
    if (this.x_class || this.y_class) {
      this.html_element.classList.remove(this.x_class, this.y_class)
    }
    this.x_class = 'x' + this.x
    this.y_class = 'y' + this.y
    this.html_element.classList.add(this.x_class, this.y_class)
  }

  update_attacking_board() {
    if (!moved[WHITE_CLASS] && !moved[BLACK_CLASS] && this.attacking_board.value) {
      return this.attacking_board
    }
    this.attacking_board.set_value(0)
    return this._update_attacking_board()
  }

  _update_attacking_board() {}

  move_to_callback() {}

  set_x(_x) {
    this.x = parseInt(_x)
  }

  set_y(_y) {
    this.y = parseInt(_y)
  }

  move_to(cell) {
    let piece = HTML_BOARD.querySelector('.' + PIECE_CLASS + '.x' + cell.dataset.x + '.y' + cell.dataset.y)
    this.set_x(cell.dataset.x)
    this.set_y(cell.dataset.y)
    this.position_board.set_position(this.x, this.y)
    this.update_html_position()
    this.update_attacking_board()
    moved[this.color ? WHITE_CLASS : BLACK_CLASS] = true
    turn = !this.color

    if (piece) {
      let enemies = this.get_enemies()
      for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].x == cell.dataset.x && enemies[i].y == cell.dataset.y) {
          enemies[i].capture()
          captured[this.color ? BLACK_CLASS : WHITE_CLASS].push(enemies.splice(i, 1))
          moved[this.color ? BLACK_CLASS : WHITE_CLASS] = true
          break
        }
      }
    }

    this.move_to_callback()
  }

  get_enemies() {
    return this.color ? black_pieces : white_pieces
  }

  capture() {
    this.set_x(this.original_x)
    this.set_y(this.original_y)
    this.draw([DEAD_CLASS])
  }

  check_position_add(dir, x, y, capture_only = false, no_capture = false) {

    let enemy_board = player_board(!this.color)
    let this_board = player_board(this.color)

    if (dir && x < WIDTH && x >= 0 && y < HEIGHT && y >= 0) {
      if (this_board.check_position(x, y).value) {
        return false
      }
      if (enemy_board.check_position(x, y).value) {
        if (!no_capture) this.attacking_board.add_position(x, y)
        return false
      }
      if (!capture_only) {
        this.attacking_board.add_position(x, y)
        return true
      }
    }
    return false
  }
}

class Pawn extends Piece {
  first_move = true
  html_class = 'P'

  _update_attacking_board() {
    this.check_position_add(true, this.x, this.y + this.direction, false, true)
    this.check_position_add(true, this.x + 1, this.y + this.direction, true)
    this.check_position_add(true, this.x - 1, this.y + this.direction, true)

    if (this.first_move) this.check_position_add(true, this.x, this.y + this.direction * 2, false, true)
    return this.attacking_board
  }

  move_to_callback() {
    this.first_move = false
    //check if queening TODO
  }
}

class Rook extends Piece {
  html_class = 'R'

  _update_attacking_board() {
    let u = true,
      d = true,
      l = true,
      r = true

    for (let i = 1; i < WIDTH; i++) {
      u = this.check_position_add(u, this.x, this.y + i)
      d = this.check_position_add(d, this.x, this.y - i)
      l = this.check_position_add(l, this.x - i, this.y)
      r = this.check_position_add(r, this.x + i, this.y)
    }

    return this.attacking_board
  }
}

class Knight extends Piece {
  html_class = 'N'

  _update_attacking_board() {
    this.check_position_add(true, this.x - 1, this.y + 2)
    this.check_position_add(true, this.x - 1, this.y - 2)
    this.check_position_add(true, this.x + 1, this.y + 2)
    this.check_position_add(true, this.x + 1, this.y - 2)
    this.check_position_add(true, this.x - 2, this.y + 1)
    this.check_position_add(true, this.x - 2, this.y - 1)
    this.check_position_add(true, this.x + 2, this.y - 1)
    this.check_position_add(true, this.x + 2, this.y + 1)

    return this.attacking_board
  }
}

class Bishop extends Piece {
  html_class = 'B'

  _update_attacking_board() {
    let ul = true,
      ur = true,
      dl = true,
      dr = true

    for (let i = 1; i < WIDTH; i++) {
      ul = this.check_position_add(ul, this.x - i, this.y + i)
      ur = this.check_position_add(ur, this.x + i, this.y + i)
      dl = this.check_position_add(dl, this.x - i, this.y - i)
      dr = this.check_position_add(dr, this.x + i, this.y - i)
    }

    return this.attacking_board
  }
}

class King extends Piece {
  html_class = 'K'

  _update_attacking_board() {
    this.check_position_add(true, this.x, this.y + 1)
    this.check_position_add(true, this.x, this.y - 1)
    this.check_position_add(true, this.x - 1, this.y)
    this.check_position_add(true, this.x + 1, this.y)
    this.check_position_add(true, this.x - 1, this.y + 1)
    this.check_position_add(true, this.x + 1, this.y + 1)
    this.check_position_add(true, this.x - 1, this.y - 1)
    this.check_position_add(true, this.x + 1, this.y - 1)

    return this.attacking_board
  }
}

class Queen extends Piece {
  html_class = 'Q'

  _update_attacking_board() {
    let u = true,
      d = true,
      l = true,
      r = true,
      ul = true,
      ur = true,
      dl = true,
      dr = true

    for (let i = 1; i < WIDTH; i++) {
      u = this.check_position_add(u, this.x, this.y + i)
      d = this.check_position_add(d, this.x, this.y - i)
      l = this.check_position_add(l, this.x - i, this.y)
      r = this.check_position_add(r, this.x + i, this.y)
      ul = this.check_position_add(ul, this.x - i, this.y + i)
      ur = this.check_position_add(ur, this.x + i, this.y + i)
      dl = this.check_position_add(dl, this.x - i, this.y - i)
      dr = this.check_position_add(dr, this.x + i, this.y - i)
    }

    return this.attacking_board
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
  for (var i = 0; i < highlighted_cells.length; i++) highlighted_cells[i].classList.remove(HIGHLIGHTED_CLASS)
  highlighted_cells = []
}

function get_cell(x, y) {
  return HTML_BOARD.querySelector("[data-x='" + x + "'][data-y='" + y + "']")
}

function draw_pieces() {
  // we can cache these TODO
  for (var i = 0; i < white_pieces.length; i++) white_pieces[i].draw()
  for (var i = 0; i < black_pieces.length; i++) black_pieces[i].draw()
  for (var i = 0; i < captured[BLACK_CLASS].length; i++) captured[BLACK_CLASS][i].draw()
  for (var i = 0; i < captured[WHITE_CLASS].length; i++) captured[WHITE_CLASS][i].draw()
}

function piece_selected(element, piece) {
  if (piece.color == turn) {
    element.classList.add(SELECTED_CLASS)
    highlight_cells(piece.update_attacking_board().coordinates())

    if (selected_element) selected_element.classList.remove(SELECTED_CLASS)

    selected_element = element
    selected_piece = piece
    HTML_BOARD.classList.add(SELECTING_CLASS)
  }
}

function cell_selected(event) {
  let cell = event.target
  if (selected_element && cell.classList.contains(HIGHLIGHTED_CLASS)) selected_piece.move_to(cell)
  clear_highlighted_cells()
  if (selected_element) selected_element.classList.remove(SELECTED_CLASS)
  HTML_BOARD.classList.remove(SELECTING_CLASS)
  selected_element = null
  selected_piece = null
}

function player_board(color) {
  let col_index = color ? 'w' : 'b'

  if (!moved[col_index] && cached_player_boards[col_index]) {
    return cached_player_boards[col_index]
  }

  pieces = color ? white_pieces : black_pieces

  let position_board = new Bitboard(WIDTH, HEIGHT)
  for (let i = 0; i < pieces.length; i++) {
    position_board.or(pieces[i].position_board, true)
  }
  moved[col_index] = false
  cached_player_boards[col_index] = position_board
  return position_board
}

function shift(num, bits) {
  return num * Math.pow(2, bits);
}

init();