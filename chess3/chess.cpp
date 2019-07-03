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

    virtual std::string type(void) = 0;

    virtual std::uint64_t attacking_bitboard(void) = 0;

    std::string label()
    {
      return type().append(color);
    }

};

class Pawn : public Piece {

  using Piece::Piece;

  private :

    const char *color;
    std::uint64_t bitboard;

  public:

    std::string type()
    {
      return "p";
    }

    std::uint64_t attacking_bitboard()
    {
      return bitboard;
    }

};

void setup(int width, int height) {

  int total = width * height;

  std::vector<Piece*> blacks;
  std::vector<Piece*> whites;

  for (int i = 0; i < width; i++) {

    blacks.push_back(new Pawn(BLACK, 1ULL << (i + width)));
    whites.push_back(new Pawn(WHITE, 1ULL << (i + total - width)));


    std::cout << blacks[i]->label();

  }
}

int main() {

  std::cout << "main";

  setup(8, 8);

  return 0;
}
