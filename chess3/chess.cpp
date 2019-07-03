#include <iostream>
#include <cstdint>
#include <vector>

const char * WHITE = "w";
const char * BLACK = "b";

class Piece {

  private :

    const char *color;
    std::uint64_t bitboard;

  public :

    explicit Piece(const char* _color, std::uint64_t _bitboard)
    {
      color = _color;
      bitboard = _bitboard;
    }

    static const char *type;

    virtual std::uint64_t attacking_bitboard();

    std::string label()
    {
      return std::string(type).append(color);
    }

};

class Pawn : public Piece {

  using Piece::Piece;

  private :

    const char *color;
    std::uint64_t bitboard;

  public:

    static const char type = 'p';

    std::uint64_t attacking_bitboard()
    {
      return bitboard;
    }

};

void setup(int width, int height) {

  int total = width * height;

  std::vector< Piece > blacks;
  std::vector< Piece > whites;

  for (int i = 0; i < width; i++) {

    Piece blacks[i] = new Pawn(BLACK, 1ULL << (i + width));
    Piece whites[i] = new Pawn(WHITE, 1ULL << (i + total - width));


    std::cout << blacks[i].label();

  }
}

int main() {

  std::cout << "main";

  setup(8, 8);

  return 0;
}
