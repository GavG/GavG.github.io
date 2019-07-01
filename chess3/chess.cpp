#include <iostream>
#include <cstdint>
#include <vector>

#define WHITE 'w';
#define BLACK 'b';

#define PAWN 'P';

class Piece
{
  private :
    char type;
    char color;
    uint64_t bitboard;

  public :
    Piece(char _type, char _color, uint64_t _bitboard)
    {
      type = _type;
      color = _color;
      bitboard = _bitboard;
    }

    uint64_t attacking_bitboard()
    {
      switch(type) {
        case 'p' :
          return bitboard;
      }
      return bitboard;
    }

    string label()
    {
      
    }
};

void setup(int width, int height)
{

  int total = width * height;

  std::vector< Piece > blacks;
  std::vector< Piece > whites;

  for (int i = 0; i < width; i++) {

    Piece blacks[i] = new Piece(PAWN, BLACK, 1ULL << i + width);
    Piece whites[i] = new Piece(PAWN, WHITE, 1ULL << i + total - width);

  }
}

int main()
{
  std::cout << "main";

  setup(8, 8);

  return 0;
}
