let curBoard;
let curPlayer;

let flags;

let curHeldPiece;
let curHeldPieceStartingPosition;

var sound = new Audio("sounds/movement.wav"); // buffers automatically when created

const INF = 1e7;
const MAX_DEPTH = 4;

const knight = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, +0.0, +0.0, +0.0, +0.0, -2.0, -4.0],
    [-3.0, +0.0, +1.0, +1.5, +1.5, +1.0, +0.0, -3.0],
    [-3.0, +0.0, +1.5, +2.0, +2.0, +1.5, +0.0, -3.0],
    [-3.0, +0.0, +1.5, +2.0, +2.0, +1.5, +0.0, -3.0],
    [-3.0, +0.0, +1.0, +1.5, +1.5, +1.0, +0.0, -3.0],
    [-4.0, -2.0, +0.0, +0.0, +0.0, +0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
];

const white_pawns = [
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+5.0, +5.0, +5.0, +5.0, +5.0, +5.0, +5.0, +5.0],
    [+1.0, +1.0, +2.0, +3.0, +3.0, +2.0, +1.0, +1.0],
    [-3.0, +0.5, +1.5, +2.5, +2.5, +1.5, +0.5, -3.0],
    [+1.5, +0.0, +1.5, +2.0, +2.0, +1.5, +0.0, +1.5],
    [+1.5, -0.5, -1.0, +0.0, +0.0, -1.0, -0.5, +1.5],
    [+0.5, +1.0, +1.0, -2.0, -2.0, +1.0, +1.0, +0.5],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0]
];

const white_king = [
    [-2.5, -2.5, -2.5, -2.5, -2.5, -2.5, -2.5, -2.5],
    [-1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5],
    [-0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5],
    [-0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5],
    [-0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.5, +0.5, +0.0, +0.0, +0.0, +0.0, +0.5, +0.5],
    [+2.0, +3.0, +2.0, +0.0, +0.0, +1.0, +3.0, +2.0]
];

const bishop = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, +0.5, +0.0, +0.0, +0.0, +0.0, +0.5, -1.0],
    [-1.0, +0.5, +0.0, +1.0, +1.0, +0.0, +0.5, -1.0],
    [-1.0, +0.5, +1.0, +1.0, +1.0, +1.0, +0.5, -1.0],
    [-1.0, +0.5, +1.0, +1.0, +1.0, +1.0, +0.5, -1.0],
    [-1.0, +0.5, +0.0, +0.5, +0.5, +0.0, +0.5, -1.0],
    [-1.0, +0.5, +0.0, +0.0, +0.0, +0.0, +0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

const black_king = [
    [+2.0, +3.0, +2.0, +0.0, +0.0, +1.0, +3.0, +2.0],
    [+0.5, +0.5, +0.0, +0.0, +0.0, +0.0, +0.5, +0.5],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [-0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5],
    [-0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5],
    [-1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5],
    [-2.5, -2.5, -2.5, -2.5, -2.5, -2.5, -2.5, -2.5]
];

const white_rook = [
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [-5.0, -5.0, -5.0, +2.0, +2.0, +2.0, -5.0, -5.0]
];

const black_rook = [
    [-5.0, -5.0, -5.0, +2.0, +2.0, +2.0, -5.0, -5.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
];

const black_pawns = [
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    [+0.5, +1.0, +1.0, -2.0, -2.0, +1.0, +1.0, +0.5],
    [+1.5, -0.5, -1.0, +0.0, +0.0, -1.0, -0.5, +1.5],
    [+1.5, +0.5, +1.5, +2.5, +2.5, +1.5, +0.5, +1.5],
    [-2.0, +0.0, +1.5, +2.0, +2.0, +1.5, +0.0, -2.0],
    [+1.0, +1.0, +2.0, +3.0, +3.0, +2.0, +1.0, +1.0],
    [+5.0, +5.0, +5.0, +5.0, +5.0, +5.0, +5.0, +5.0],
    [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0]
];

const piece_value = {
    'R': 50,
    'N': 30,
    'B': 30,
    'Q': 90,
    'K': INF,
    'P': 10,
    'r': -50,
    'n': -30,
    'b': -30,
    'q': -90,
    'k': -INF,
    'p': -10
};

function check_type_of_piece(ch) {
    if (ch.toUpperCase() == ch) {
        return 0;
    } else {
        return 1;
    }
}

class Move {
    constructor(c1, c2, chess_notation, x1, y1, x2, y2) {
        this.c1 = c1;   //initial position. Eg. A1 or F3
        this.c2 = c2;
        this.chess_notation = chess_notation;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

function create_move(x1, y1, x2, y2, piece, moved_here) {
    const obj = new Move();
    obj.x1 = x1;
    obj.y1 = y1;
    obj.x2 = x2;
    obj.y2 = y2;
    return obj;
}

class Chessboard {
    constructor(board, short_castling_white=true, long_castling_white=true, short_castling_black=true, 
        long_castling_black=true, has_game_ended=false, check=false, turn=0) {
        this.board = [[],[],[],[],[],[],[],[]];
        for (var i = 0; i < 8; i++) {
            this.board.push(board[i]);
            for (var j = 0; j < 8; j++) {
                this.board[7 - i].push(board[i][j]);
            }
        }
        this.short_castling_white = short_castling_white;
        this.long_castling_white = long_castling_white;
        this.short_castling_black = short_castling_black;
        this.long_castling_black = long_castling_black;
        this.has_game_ended = has_game_ended; 
        //either stalemate or checkmate
        this.check = check; 
        //is the king in check?
        this.turn = turn; 
        //0 for white 1 for black (integer)
    }
}


function board_value(b) {
    let value = 0.0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (b.board[i][j] == '.') continue;
            value += piece_value[b.board[i][j]];
            if (check_type_of_piece(b.board[i][j]) == 0) {
                if (b.board[i][j] == 'P') {
                    value += white_pawns[7 - i][j];
                }
                else if (b.board[i][j] == 'N') {
                    value += knight[7 - i][j];
                }
                else if (b.board[i][j] == 'K') {
                    value += white_king[7 - i][j];
                }
                else if (b.board[i][j] == 'B') {
                    value += bishop[7 - i][j];
                }
                else if (b.board[i][j] == 'R') {
                    value += white_rook[7 - i][j];
                }
            }
            else {
                if (b.board[i][j] == 'p') {
                    value -= black_pawns[7 - i][j];
                }
                else if (b.board[i][j] == 'n') {
                    value -= knight[7 - i][j];
                }
                else if (b.board[i][j] == 'k') {
                    value -= black_king[7 - i][j];
                }
                else if (b.board[i][j] == 'b') {
                    value -= bishop[7 - i][j];
                }
                else if (b.board[i][j] == 'r') {
                    value -= black_rook[7 - i][j];
                }
            }
        }
    }
    return value;
}

function calculate_all_possible_moves(b) {
    let points_under_threat = [];
    for (var i = 0; i < 8; i++) {
        let temp = [];
        for (var j = 0; j < 8; j++) {
            temp.push(false);
        }
        points_under_threat.push(temp);
    }

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (b.board[i][j] == '.') continue;
            if (check_type_of_piece(b.board[i][j]) != b.turn) {
                if (b.board[i][j] == 'N' || b.board[i][j] == 'n') {
                    if (i - 1 >= 0 && j - 2 >= 0) {
                        points_under_threat[i - 1][j - 2] = true;
                    }
                    if (i - 1 >= 0 && j + 2 < 8) {
                        points_under_threat[i - 1][j + 2] = true;
                    }
                    if (i - 2 >= 0 && j - 1 >= 0) {
                        points_under_threat[i - 2][j - 1] = true;
                    }
                    if (i - 2 >= 0 && j + 1 < 8) {
                        points_under_threat[i - 2][j + 1] = true;
                    }
                    if (i + 1 < 8 && j - 2 >= 0) {
                        points_under_threat[i + 1][j - 2] = true;
                    }
                    if (i + 1 < 8 && j + 2 < 8) {
                        points_under_threat[i + 1][j + 2] = true;
                    }
                    if (i + 2 < 8 && j - 1 >= 0) {
                        points_under_threat[i + 2][j - 1] = true;
                    }
                    if (i + 2 < 8 && j + 1 < 8) {
                        points_under_threat[i + 2][j + 1] = true;
                    }
                }
                if (b.board[i][j] == 'K' || b.board[i][j] == 'k') {
                    //king
                    if (i - 1 >= 0 && j >= 0) {
                        points_under_threat[i - 1][j] = true;
                    }
                    if (i - 1 >= 0 && j + 1 < 8) {
                        points_under_threat[i - 1][j + 1] = true;
                    }
                    if (i - 1 >= 0 && j - 1 >= 0) {
                        points_under_threat[i - 1][j - 1] = true;
                    }
                    if (i + 1 < 8 && j >= 0) {
                        points_under_threat[i + 1][j] = true;
                    }
                    if (i + 1 < 8 && j + 1 < 8) {
                        points_under_threat[i + 1][j + 1] = true;
                    }
                    if (i + 1 < 8 && j - 1 >= 0) {
                        points_under_threat[i + 1][j - 1] = true;
                    }
                    if (i < 8 && j - 1 >= 0) {
                        points_under_threat[i][j - 1] = true;
                    }
                    if (i < 8 && j + 1 < 8) {
                        points_under_threat[i][j + 1] = true;
                    }
                }
                if (b.board[i][j] == 'B' || b.board[i][j] == 'b' || b.board[i][j] == 'Q' || b.board[i][j] == 'q') {
                    var x = i, y = j;
                    while (--x >= 0 && --y >= 0) {
                        if (b.board[x][y] == '.') {
                            points_under_threat[x][y] = true;
                            continue;
                        }
                        else {
                            points_under_threat[x][y] = true;
                            break;
                        }
                    }
                    x = i, y = j;
                    while (--x >= 0 && ++y < 8) {
                        if (b.board[x][y] == '.') {
                            points_under_threat[x][y] = true;
                            continue;
                        }
                        else {
                            points_under_threat[x][y] = true;
                            break;
                        }
                    }
                    x = i, y = j;
                    while (++x < 8 && --y >= 0) {
                        if (b.board[x][y] == '.') {
                            points_under_threat[x][y] = true;
                            continue;
                        }
                        else {
                            points_under_threat[x][y] = true;
                            break;
                        }
                    }
                    x = i, y = j;
                    while (++x < 8 && ++y < 8) {
                        if (b.board[x][y] == '.') {
                            points_under_threat[x][y] = true;
                            continue;
                        }
                        else {
                            points_under_threat[x][y] = true;
                            break;
                        }
                    }
                }
                if (b.board[i][j] == 'R' || b.board[i][j] == 'r' || b.board[i][j] == 'Q' || b.board[i][j] == 'q') {
                    var x = i, y = j;
                    while (--x >= 0) {
                        if (b.board[x][y] == '.') {
                            points_under_threat[x][y] = true;
                            continue;
                        }
                        else {
                            points_under_threat[x][y] = true;
                            break;
                        }
                    }
                    x = i, y = j;
                    while (++x < 8) {
                        if (b.board[x][y] == '.') {
                            points_under_threat[x][y] = true;
                            continue;
                        }
                        else {
                            points_under_threat[x][y] = true;
                            break;
                        }
                    }
                    x = i, y = j;
                    while (++y < 8) {
                        if (b.board[x][y] == '.') {
                            points_under_threat[x][y] = true;
                            continue;
                        }
                        else {
                            points_under_threat[x][y] = true;
                            break;
                        }
                    }
                    x = i, y = j;
                    while (--y >= 0) {
                        if (b.board[x][y] == '.') {
                            points_under_threat[x][y] = true;
                            continue;
                        }
                        else {
                            points_under_threat[x][y] = true;
                            break;
                        }
                    }
                }
                if (b.board[i][j] == 'P') {
                    if (i + 1 < 8 && j - 1 >= 0) {
                        points_under_threat[i + 1][j - 1] = true;
                    }
                    if (i + 1 < 8 && j + 1 < 8) {
                        points_under_threat[i + 1][j + 1] = true;
                    }
                }
                else if (b.board[i][j] == 'p') {
                    if (i - 1 >= 0 && j - 1 >= 0) {
                        points_under_threat[i - 1][j - 1] = true;
                    }
                    if (i - 1 >= 0 && j + 1 < 8) {
                        points_under_threat[i - 1][j + 1] = true;
                    }
                }
            }
        }
    }

    const possible_moves = [];

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (b.board[i][j] == '.') continue;
            if (check_type_of_piece(b.board[i][j]) == b.turn) {
                if (b.board[i][j] == 'B' || b.board[i][j] == 'b' || b.board[i][j] == 'Q' || b.board[i][j] == 'q') {
                    var x = i, y = j;
                    while (--x >= 0 && --y >= 0) {
                        if (b.board[x][y] == '.' || check_type_of_piece(b.board[x][y]) != b.turn) {
                            possible_moves.push(create_move(i, j, x, y, b.board[i][j], b.board[x][y]));
                        }
                        if (b.board[x][y] != '.') break;
                    }
                    x = i, y = j;
                    while (--x >= 0 && ++y < 8) {
                        if (b.board[x][y] == '.' || check_type_of_piece(b.board[x][y]) != b.turn) {
                            possible_moves.push(create_move(i, j, x, y, b.board[i][j], b.board[x][y]));
                        }
                        if (b.board[x][y] != '.') break;
                    }
                    x = i, y = j;
                    while (++x < 8 && --y >= 0) {
                        if (b.board[x][y] == '.' || check_type_of_piece(b.board[x][y]) != b.turn) {
                            possible_moves.push(create_move(i, j, x, y, b.board[i][j], b.board[x][y]));
                        }
                        if (b.board[x][y] != '.') break;
                    }
                    x = i, y = j;
                    while (++x < 8 && ++y < 8) {
                        if (b.board[x][y] == '.' || check_type_of_piece(b.board[x][y]) != b.turn) {
                            possible_moves.push(create_move(i, j, x, y, b.board[i][j], b.board[x][y]));
                        }
                        if (b.board[x][y] != '.') break;
                    }
                }
                if (b.board[i][j] == 'N' || b.board[i][j] == 'n') {
                    if (i - 1 >= 0 && j - 2 >= 0 && ((b.board[i - 1][j - 2] == '.') ||
                                                     (check_type_of_piece(b.board[i - 1][j - 2]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i - 1, j - 2, b.board[i][j], b.board[i - 1][j - 2]));
                    }
                    if (i - 1 >= 0 && j + 2 < 8 && ((b.board[i - 1][j + 2] == '.') ||
                                                     (check_type_of_piece(b.board[i - 1][j + 2]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i - 1, j + 2, b.board[i][j], b.board[i - 1][j + 2]));
                    }
                    if (i - 2 >= 0 && j - 1 >= 0 && ((b.board[i - 2][j - 1] == '.') ||
                                                     (check_type_of_piece(b.board[i - 2][j - 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i - 2, j - 1, b.board[i][j], b.board[i - 2][j - 1]));
                    }
                    if (i - 2 >= 0 && j + 1 < 8 && ((b.board[i - 2][j + 1] == '.') ||
                                                     (check_type_of_piece(b.board[i - 2][j + 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i - 2, j + 1, b.board[i][j], b.board[i - 2][j + 1]));
                    }
                    if (i + 1 < 8 && j - 2 >= 0 && ((b.board[i + 1][j - 2] == '.') ||
                                                     (check_type_of_piece(b.board[i + 1][j - 2]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i + 1, j - 2, b.board[i][j], b.board[i + 1][j - 2]));
                    }
                    if (i + 1 < 8 && j + 2 < 8 && ((b.board[i + 1][j + 2] == '.') ||
                                                     (check_type_of_piece(b.board[i + 1][j + 2]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i + 1, j + 2, b.board[i][j], b.board[i + 1][j + 2]));
                    }
                    if (i + 2 < 8 && j - 1 >= 0 && ((b.board[i + 2][j - 1] == '.') ||
                                                     (check_type_of_piece(b.board[i + 2][j - 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i + 2, j - 1, b.board[i][j], b.board[i + 2][j - 1]));
                    }
                    if (i + 2 < 8 && j + 1 < 8 && ((b.board[i + 2][j + 1] == '.') ||
                                                     (check_type_of_piece(b.board[i + 2][j + 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i + 2, j + 1, b.board[i][j], b.board[i + 2][j + 1]));
                    }
                }


                if (b.board[i][j] == 'R' || b.board[i][j] == 'r' || b.board[i][j] == 'Q' || b.board[i][j] == 'q') {
                    var x = i, y = j;
                    while (--x >= 0) {
                        if (b.board[x][y] == '.' || check_type_of_piece(b.board[x][y]) != b.turn) {
                            possible_moves.push(create_move(i, j, x, y, b.board[i][j], b.board[x][y]));
                        }
                        if (b.board[x][y] != '.') break;
                    }
                    x = i, y = j;
                    while (++x < 8) {
                        if (b.board[x][y] == '.' || check_type_of_piece(b.board[x][y]) != b.turn) {
                            possible_moves.push(create_move(i, j, x, y, b.board[i][j], b.board[x][y]));
                        }
                        if (b.board[x][y] != '.') break;
                    }
                    x = i, y = j;
                    while (++y < 8) {
                        if (b.board[x][y] == '.' || check_type_of_piece(b.board[x][y]) != b.turn) {
                            possible_moves.push(create_move(i, j, x, y, b.board[i][j], b.board[x][y]));
                        }
                        if (b.board[x][y] != '.') break;
                    }
                    x = i, y = j;
                    while (--y >= 0) {
                        if (b.board[x][y] == '.' || check_type_of_piece(b.board[x][y]) != b.turn) {
                            possible_moves.push(create_move(i, j, x, y, b.board[i][j], b.board[x][y]));
                        }
                        if (b.board[x][y] != '.') break;
                    }
                }



                if (b.board[i][j] == 'P') {
                    if (i + 1 < 8 && j - 1 >= 0 && b.board[i + 1][j - 1] != '.' &&
                        (check_type_of_piece(b.board[i + 1][j - 1]) != b.turn)) {
                        possible_moves.push(create_move(i, j, i + 1, j - 1, b.board[i][j], b.board[i + 1][j - 1]));
                    }
                    if (i + 1 < 8 && j + 1 < 8 && b.board[i + 1][j + 1] != '.' &&
                        (check_type_of_piece(b.board[i + 1][j + 1]) != b.turn)) {
                        possible_moves.push(create_move(i, j, i + 1, j + 1, b.board[i][j], b.board[i + 1][j + 1]));
                    }
                    if (i + 1 < 8 && b.board[i + 1][j] == '.') {
                        possible_moves.push(create_move(i, j, i + 1, j, b.board[i][j], b.board[i + 1][j]));
                    }
                    if (i == 1 && b.board[i + 1][j] == '.' && b.board[i + 2][j] == '.') {
                        possible_moves.push(create_move(i, j, i + 2, j, b.board[i][j], b.board[i + 2][j]));
                    }
                }
                else if (b.board[i][j] == 'p') {
                    if (i - 1 >= 0 && j - 1 >= 0 && b.board[i - 1][j - 1] != '.' &&
                        (check_type_of_piece(b.board[i - 1][j - 1]) != b.turn)) {
                        possible_moves.push(create_move(i, j, i - 1, j - 1, b.board[i][j], b.board[i - 1][j - 1]));
                    }
                    if (i - 1 >= 0 && j + 1 < 8 && b.board[i - 1][j + 1] != '.' &&
                        (check_type_of_piece(b.board[i - 1][j + 1]) != b.turn)) {
                        possible_moves.push(create_move(i, j, i - 1, j + 1, b.board[i][j], b.board[i - 1][j + 1]));
                    }
                    if (i - 1 >= 0 && b.board[i - 1][j] == '.') {
                        possible_moves.push(create_move(i, j, i - 1, j, b.board[i][j], b.board[i - 1][j]));
                    }
                    if (i == 6 && b.board[i - 1][j] == '.' && b.board[i - 2][j] == '.') {
                        possible_moves.push(create_move(i, j, i - 2, j, b.board[i][j], b.board[i - 2][j]));
                    }
                }

                if (b.board[i][j] == 'K' || b.board[i][j] == 'k') {
                    if (i - 1 >= 0 && j >= 0 && (points_under_threat[i - 1][j] == false) && ((b.board[i - 1][j] == '.') ||
                                                     (check_type_of_piece(b.board[i - 1][j]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i - 1, j, b.board[i][j], b.board[i - 1][j]));
                    }
                    if (i - 1 >= 0 && j + 1 < 8 && (points_under_threat[i - 1][j + 1] == false) && ((b.board[i - 1][j + 1] == '.') ||
                                                     (check_type_of_piece(b.board[i - 1][j + 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i - 1, j + 1, b.board[i][j], b.board[i - 1][j + 1]));
                    }
                    if (i - 1 >= 0 && j - 1 >= 0 && (points_under_threat[i - 1][j - 1] == false) && ((b.board[i - 1][j - 1] == '.') ||
                                                     (check_type_of_piece(b.board[i - 1][j - 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i - 1, j - 1, b.board[i][j], b.board[i - 1][j - 1]));
                    }
                    if (i + 1 < 8 && j >= 0 && (points_under_threat[i + 1][j] == false) && ((b.board[i + 1][j] == '.') ||
                                                     (check_type_of_piece(b.board[i + 1][j]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i + 1, j, b.board[i][j], b.board[i + 1][j]));
                    }
                    if (i + 1 < 8 && j + 1 < 8 && (points_under_threat[i + 1][j + 1] == false) && ((b.board[i + 1][j + 1] == '.') ||
                                                     (check_type_of_piece(b.board[i + 1][j + 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i + 1, j + 1, b.board[i][j], b.board[i + 1][j + 1]));
                    }
                    if (i + 1 < 8 && j - 1 >= 0 && (points_under_threat[i + 1][j - 1] == false) && ((b.board[i + 1][j - 1] == '.') ||
                                                     (check_type_of_piece(b.board[i + 1][j - 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i + 1, j - 1, b.board[i][j], b.board[i + 1][j - 1]));
                    }
                    if (i < 8 && j - 1 >= 0 && (points_under_threat[i][j - 1] == false) && ((b.board[i][j - 1] == '.') ||
                                                     (check_type_of_piece(b.board[i][j - 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i, j - 1, b.board[i][j], b.board[i][j - 1]));
                    }
                    if (i < 8 && j + 1 < 8 && (points_under_threat[i][j + 1] == false) && ((b.board[i][j + 1] == '.') ||
                                                     (check_type_of_piece(b.board[i][j + 1]) != b.turn))) {
                        possible_moves.push(create_move(i, j, i, j + 1, b.board[i][j], b.board[i][j + 1]));
                    }
                }

            }
        }
    }
    if (b.turn == 0) {
        //white
        if (b.short_castling_white && b.check == false && b.board[0][5] == '.' && b.board[0][6] == '.' && points_under_threat[0][5] == false && points_under_threat[0][6] == false && points_under_threat[0][4] == false) {
            possible_moves.push(create_move(0, 4, 0, 6, b.board[0][4], ' '));
        }
        if (b.long_castling_white && b.check == false && b.board[0][1] == '.' && b.board[0][2] == '.' && b.board[0][3] == '.' && points_under_threat[0][2] == false && points_under_threat[0][3] == false && points_under_threat[0][4] == false) {
            possible_moves.push(create_move(0, 4, 0, 2, b.board[0][4], ' '));
        }
    }
    else {
        //black
        if (b.short_castling_black && b.check == false && b.board[7][5] == '.' && b.board[7][6] == '.' && points_under_threat[7][5] == false && points_under_threat[7][6] == false && points_under_threat[7][4] == false) {
            possible_moves.push(create_move(7, 4, 7, 6, b.board[7][4], ' '));
        }
        if (b.long_castling_black && b.check == false && b.board[7][1] == '.' && b.board[7][2] == '.' && b.board[7][3] == '.' && points_under_threat[7][2] == false && points_under_threat[7][3] == false && points_under_threat[7][4] == false) {
            possible_moves.push(create_move(7, 4, 7, 2, b.board[7][4], ' '));
        }
    }
    return possible_moves;
}

function find_best_move(b, depth, alpha, beta) {
    if (depth == MAX_DEPTH) {
        let value = board_value(b);
        const obj = {"boardValue": value};
        return obj;
    }
    let all_moves = calculate_all_possible_moves(b);
    let to_be_played;
    let old_board = JSON.parse(JSON.stringify(b));
    let best_board_value = -1e9, worst_board_value = 1e9;
    for (let z of all_moves) {
        b = JSON.parse(JSON.stringify(old_board));
        let old_x1_y1 = b.board[z.x1][z.y1];
        let old_x2_y2 = b.board[z.x2][z.y2];
        b.board[z.x2][z.y2] = b.board[z.x1][z.y1];
        b.board[z.x1][z.y1] = '.';
        if ((old_x1_y1 == 'p' || old_x1_y1 == 'P') && 
        (z.x2 == 7 || z.x2 == 0)) {
            if (old_x1_y1 == 'p') {
                b.board[z.x2][z.y2] = 'q';
            } else {
                b.board[z.x2][z.y2] = 'Q';
            }
        }
        if (old_x1_y1 == 'K') {
            b.short_castling_white = b.long_castling_white = false;
            if (z.x1 == 0 && z.y1 == 4 && z.x2 == 0 && z.y2 == 6) {
                b.board[0][5] = 'R';
                b.board[0][7] = '.';
            }
            if (z.x1 == 0 && z.y1 == 4 && z.x2 == 0 && z.y2 == 2) {
                b.board[0][3] = 'R';
                b.board[0][0] = '.';
             }
        }
        if (old_x1_y1 == 'k') {
            b.short_castling_black = b.long_castling_black = false;
            if (z.x1 == 7 && z.y1 == 4 && z.x2 == 7 && z.y2 == 6) {
                b.board[7][5] = 'r';
                b.board[7][7] = '.';
            }
            if (z.x1 == 7 && z.y1 == 4 && z.x2 == 7 && z.y2 == 2) {
                b.board[7][3] = 'r';
                b.board[7][0] = '.';
             }
        }

        if (old_x1_y1 == 'R' && z.x1 == 0 && z.y1 == 0) {
            b.long_castling_white = false;
        }
        if (old_x1_y1 == 'R' && z.x1 == 0 && z.y1 == 7) {
            b.short_castling_white = false;
        }
        if (old_x1_y1 == 'r' && z.x1 == 7 && z.y1 == 0) {
            b.long_castling_black = false;
        }
        if (old_x1_y1 == 'r' && z.x1 == 7 && z.y1 == 7) {
            b.short_castling_black = false;
        }
        b.turn = old_board.turn ^ 1;

        if (old_x2_y2 == 'k' || old_x2_y2 == 'K') {
            b = old_board;
            if (old_x2_y2 == 'k') {
                alpha = Math.max(alpha, (10 - depth) * INF);
                const obj = {
                    bestMove: z,
                    boardValue: (10 - depth) * INF
                };
                return obj;
            } 
            else {
                beta = Math.min(beta, (10 - depth) * (-INF));
                const obj = {
                    bestMove: z,
                    boardValue: (10 - depth) * (-INF)
                };
                return obj;
            }
        }

        const best = find_best_move(b, depth + 1, alpha, beta);
        if (old_board.turn == 0) {
            if (best.boardValue > best_board_value) {
                best_board_value = best.boardValue;
                to_be_played = z;
            }
            alpha = Math.max(alpha, best_board_value);
        }
        else {
            if (best.boardValue < worst_board_value) {
                worst_board_value = best.boardValue;
                to_be_played = z;
            }
            beta = Math.min(beta, worst_board_value);
        }
        if (beta <= alpha)
            break;
    }
    if (old_board.turn == 0) {
        const best_move = {
            bestMove: to_be_played,
            boardValue: best_board_value
        };
        return best_move;
    } else {
        const best_move = {
            bestMove: to_be_played,
            boardValue: worst_board_value
        };
        return best_move;
    }
}


function startGame() {
    const starterPosition = [['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']];


    const starterPlayer = 'white';

    loadPosition(starterPosition, starterPlayer);
}

function loadPosition(position, playerToMove) {
    curBoard = position;
    curPlayer = playerToMove;
    flags = {
        short_castling_white: true,
        long_castling_white: true,
        short_castling_black: true,
        long_castling_black: true
    };

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (position[i][j] != '.') {
                loadPiece(position[i][j], [i + 1, j + 1]);
            }
        }
    }
}

function loadPiece(piece, position) {
    const squareElement = document.getElementById(`${position[0]}${position[1]}`);

    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = false;
    pieceElement.src = getPieceImageSource(piece);

    squareElement.appendChild(pieceElement);
}

function getPieceImageSource(piece) {
    switch (piece) {
        case 'r': return 'assets/black_rook.png';
        case 'n': return 'assets/black_knight.png';
        case 'b': return 'assets/black_bishop.png';
        case 'q': return 'assets/black_queen.png';
        case 'k': return 'assets/black_king.png';
        case 'p': return 'assets/black_pawn.png';
        case 'R': return 'assets/white_rook.png';
        case 'N': return 'assets/white_knight.png';
        case 'B': return 'assets/white_bishop.png';
        case 'Q': return 'assets/white_queen.png';
        case 'K': return 'assets/white_king.png';
        case 'P': return 'assets/white_pawn.png';
        default : console.log("No image for empty square");
    }
}

function setPieceHoldEvents() {
    let mouseX, mouseY = 0;

    document.addEventListener('mousemove', function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    let pieces = document.getElementsByClassName('piece');
    let movePieceInterval;
    let hasIntervalStarted = false;

    for (const piece of pieces) {
        piece.addEventListener('mousedown', function(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        
            if (hasIntervalStarted === false) {
                piece.style.position = 'absolute';

                curHeldPiece = piece;
                const curHeldPieceStringPosition = piece.parentElement.id.split('');

                curHeldPieceStartingPosition = [parseInt(curHeldPieceStringPosition[0]) - 1, parseInt(curHeldPieceStringPosition[1]) - 1];

                movePieceInterval = setInterval(function() {
                    piece.style.top = mouseY - piece.offsetHeight / 2 + window.scrollY + 'px';
                    piece.style.left = mouseX - piece.offsetWidth / 2 + window.scrollX + 'px';
                }, 1);
        
                hasIntervalStarted = true;
            }
        });
    }
        
    document.addEventListener('mouseup', function(event) {
        window.clearInterval(movePieceInterval);

        if (curHeldPiece != null) {
            const boardElement = document.querySelector('.board');

            if ((event.clientX > boardElement.offsetLeft - window.scrollX && event.clientX < boardElement.offsetLeft + boardElement.offsetWidth - window.scrollX) &&
                (event.clientY > boardElement.offsetTop - window.scrollY && event.clientY < boardElement.offsetTop + boardElement.offsetHeight - window.scrollY)) {
                    const mousePositionOnBoardX = event.clientX - boardElement.offsetLeft + window.scrollX;
                    const mousePositionOnBoardY = event.clientY - boardElement.offsetTop + window.scrollY;

                    const boardBorderSize = parseInt(getComputedStyle(document.querySelector('.board'), null)
                                                .getPropertyValue('border-left-width')
                                                .split('px')[0]);

                    const xPosition = Math.floor((mousePositionOnBoardX - boardBorderSize) / document.getElementsByClassName('square')[0].offsetWidth);
                    const yPosition = Math.floor((mousePositionOnBoardY - boardBorderSize) / document.getElementsByClassName('square')[0].offsetHeight);

                    const pieceReleasePosition = [yPosition, xPosition];

                    if (!(pieceReleasePosition[0] == curHeldPieceStartingPosition[0] && pieceReleasePosition[1] == curHeldPieceStartingPosition[1])) {
                        if (validateMovement(curHeldPieceStartingPosition, pieceReleasePosition)) {
                            movePiece(curHeldPiece, curHeldPieceStartingPosition, pieceReleasePosition);
                        }
                    }
                }

            curHeldPiece.style.position = 'static';
            curHeldPiece = null;
            curHeldPieceStartingPosition = null;
        }
    
        hasIntervalStarted = false;
    });
}

function movePiece(piece, startingPosition, endingPosition) {
    
    const newBoard = new Chessboard(curBoard);
    if (curPlayer == 'white') {
        newBoard.turn = 0;
    } else {
        newBoard.turn = 1;
    }
    
    let allPossibleMoves = calculate_all_possible_moves(newBoard);

    console.log(allPossibleMoves.length);

    let canBePlayed = false;
    for (var i = 0; i < allPossibleMoves.length; i++) {
        let move = allPossibleMoves[i];
        if (startingPosition[0] == 7 - move.x1 && startingPosition[1] == move.y1 &&
            endingPosition[0] == 7 - move.x2 && endingPosition[1] == move.y2) {
            canBePlayed = true;
            break;
        }
    }
    if (canBePlayed == false) return;

    if (piece.id == 'K') {
        flags.short_castling_white = flags.long_castling_white = false;
        if (startingPosition[0] == 7 && startingPosition[1] == 4 &&
            endingPosition[0] == 7 && endingPosition[1] == 6) {
                const pieceElement = document.createElement('img');
                pieceElement.classList.add('piece');
                pieceElement.id = 'R';
                pieceElement.draggable = true;
                pieceElement.src = getPieceImageSource('R');
                movePiece(pieceElement, [7, 7], [7, 5]);
                if (curPlayer == 'white') {
                    curPlayer = 'black';
                } else {
                    curPlayer = 'white';
                }
        }
        if (startingPosition[0] == 7 && startingPosition[1] == 4 &&
            endingPosition[0] == 7 && endingPosition[1] == 2) {
                const pieceElement = document.createElement('img');
                pieceElement.classList.add('piece');
                pieceElement.id = 'R';
                pieceElement.draggable = true;
                pieceElement.src = getPieceImageSource('R');
                movePiece(pieceElement, [7, 0], [7, 3]);
                if (curPlayer == 'white') {
                    curPlayer = 'black';
                } else {
                    curPlayer = 'white';
                }
        }
    }
    else if (piece.id == 'k') {
        flags.short_castling_black = flags.long_castling_black = false;
        if (startingPosition[0] == 0 && startingPosition[1] == 4 &&
            endingPosition[0] == 0 && endingPosition[1] == 6) {
                const pieceElement = document.createElement('img');
                pieceElement.classList.add('piece');
                pieceElement.id = 'r';
                pieceElement.draggable = true;
                pieceElement.src = getPieceImageSource('r');
                movePiece(pieceElement, [0, 7], [0, 5]);
                if (curPlayer == 'white') {
                    curPlayer = 'black';
                } else {
                    curPlayer = 'white';
                }
        }
        if (startingPosition[0] == 0 && startingPosition[1] == 4 &&
            endingPosition[0] == 0 && endingPosition[1] == 2) {
                const pieceElement = document.createElement('img');
                pieceElement.classList.add('piece');
                pieceElement.id = 'r';
                pieceElement.draggable = true;
                pieceElement.src = getPieceImageSource('r');
                movePiece(pieceElement, [0, 0], [0, 3]);
                if (curPlayer == 'white') {
                    curPlayer = 'black';
                } else {
                    curPlayer = 'white';
                }
        }
    }

    if (piece.id == 'r' && startingPosition[1] == 0) {
        flags.long_castling_black = false;
    }
    else if (piece.id == 'r' && startingPosition[1] == 7) {
        flags.short_castling_black = false;
    }
    else if (piece.id == 'R' && startingPosition[1] == 0) {
        flags.long_castling_white = false;
    }
    else if (piece.id == 'R' && startingPosition[1] == 7) {
        flags.short_castling_white = false;
    }

    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];

    if (piece.id == 'P' && endingPosition[0] == 0) {
        var bornPiece = prompt("Enter Q for Queen\nEnter R for Rook\nEnter B for Bishop\nEnter N for Knight");
        piece.id = bornPiece.toUpperCase();
        piece.src = getPieceImageSource(piece.id);
    }
    if (piece.id == 'p' && endingPosition[0] == 7) {
        var bornPiece = prompt("Enter Q for Queen\nEnter R for Rook\nEnter B for Bishop\nEnter N for Knight");
        piece.id = bornPiece.toLowerCase();
        piece.src = getPieceImageSource(piece.id);
    }

    if (boardPiece != '.') {
        if ((boardPiece === boardPiece.toLowerCase() && curPlayer == 'black') ||
            (boardPiece === boardPiece.toUpperCase() && curPlayer == 'white')) {
                curBoard[startingPosition[0]][startingPosition[1]] = '.';
                curBoard[endingPosition[0]][endingPosition[1]] = boardPiece;

                const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}`);
                destinationSquare.textContent = '';
                destinationSquare.appendChild(piece);

                const startingSquare = document.getElementById(`${startingPosition[0] + 1}${startingPosition[1] + 1}`);
                startingSquare.innerHTML = '';

                sound.play();

                // check if is check/checkmate

                if (curPlayer == 'white') {
                    curPlayer = 'black';
                } else {
                    curPlayer = 'white';
                }
        }
    }
}

function validateMovement(startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];
    
    switch (boardPiece) {
        case 'R':
        case 'r': return validateRookMovement(startingPosition, endingPosition);
        case 'N':
        case 'n': return validateKnightMovement(startingPosition, endingPosition);
        case 'B':
        case 'b': return validateBishopMovement(startingPosition, endingPosition);
        case 'Q':
        case 'q': return validateQueenMovement(startingPosition, endingPosition);
        case 'K': 
        case 'k': return validateKingMovement(startingPosition, endingPosition);
        case 'P': return validatePawnMovement('white', startingPosition, endingPosition);
        case 'p': return validatePawnMovement('black', startingPosition, endingPosition);
        default : console.log("Wrong happned");
    }
}

function validateBishopMovement(startingPosition, endingPosition) {
    return true;
    if (endingPosition[0] - endingPosition[1] == startingPosition[0] - startingPosition[1] ||
        endingPosition[0] + endingPosition[1] == startingPosition[0] + startingPosition[1]) {
            if (!validatePathIsBlocked(startingPosition, endingPosition)) {
                return false;
            }
            // validate if move puts own king in check
            return true;
    } else {
        return false;
    }
}

function validateRookMovement(startingPosition, endingPosition) {
    return true;
    if (endingPosition[0] == startingPosition[0] || endingPosition[1] == startingPosition[1]) {
        if (!validatePathIsBlocked(startingPosition, endingPosition)) {
            return false;
        }
        // validate if move puts own king in check
        return true;
    } else {
        return false;
    }
}

function validateKingMovement(startingPosition, endingPosition) {
    return true;
    if ([-1, 0, 1].includes(endingPosition[0] - startingPosition[0]) && [-1, 0, 1].includes(endingPosition[1] - startingPosition[1])) {
        if (isFriendlyPieceOnEndingPosition(endingPosition)) {
            return false;
        }
        // validate if move puts own king in check
        // validate castling
        return true;
    } else {
        return false;
    }
}

function validateQueenMovement(startingPosition, endingPosition) {
    return true;
    if (endingPosition[0] - endingPosition[1] == startingPosition[0] - startingPosition[1] ||
        endingPosition[0] + endingPosition[1] == startingPosition[0] + startingPosition[1] ||
        endingPosition[0] == startingPosition[0] || endingPosition[1] == startingPosition[1]) {
            if (!validatePathIsBlocked(startingPosition, endingPosition)) {
                return false;
            }
            // validate if move puts own king in check
            return true;
    } else {
        return false;
    }
}

function validatePawnMovement(pawnColor, startingPosition, endingPosition) {
    return true;
    direction = pawnColor == 'black' ? 1 : -1;

    let isCapture = false;

    if (endingPosition[0] == startingPosition[0] + direction &&
        [startingPosition[1] - 1, startingPosition[1] + 1].includes(endingPosition[1])) {
            // validate if is en passant
            if (isEnemyPieceOnEndingPosition(endingPosition)) {
                isCapture = true;
            }
        }

    // validate if is promotion
    let isFirstMove = false;

    if ((pawnColor == 'white' && startingPosition[0] == 6) || (pawnColor == 'black' && startingPosition[0] == 1)) {
        isFirstMove = true;
    }

    if (((endingPosition[0] == startingPosition[0] + direction || (endingPosition[0] == startingPosition[0] + direction * 2 && isFirstMove)) &&
         endingPosition[1] == startingPosition[1]) || isCapture) {
            if (isFriendlyPieceOnEndingPosition(endingPosition)) {
                return false;
            } else if (!isCapture && isEnemyPieceOnEndingPosition(endingPosition)) {
                return false;
            }

            // validate if move puts own king in check
            return true;
    } else {
        return false;
    }
}

function validateKnightMovement(startingPosition, endingPosition) {
    return true;
    if (([-2, 2].includes(endingPosition[0] - startingPosition[0]) && [-1, 1].includes(endingPosition[1] - startingPosition[1])) || 
        ([-2, 2].includes(endingPosition[1] - startingPosition[1]) && [-1, 1].includes(endingPosition[0] - startingPosition[0]))) {
            if (isFriendlyPieceOnEndingPosition(endingPosition)) {
                return false;
            }
            // validate if move puts own king in check
            return true;
    } else {
        return false;
    }
}

function validatePathIsBlocked(startingPosition, endingPosition) {
    const xDifference = endingPosition[0] - startingPosition[0]
    const yDifference = endingPosition[1] - startingPosition[1]

    let xDirection = 0;
    let yDirection = 0;

    if (xDifference < 0) {
        xDirection = -1;
    } else if (xDifference > 0) {
        xDirection = 1;
    }

    if (yDifference < 0) {
        yDirection = -1;
    } else if (yDifference > 0) {
        yDirection = 1;
    }

    let squareX = startingPosition[0] + xDirection;
    let squareY = startingPosition[1] + yDirection;

    while (squareX != endingPosition[0] || squareY != endingPosition[1]) {
        const isSquareOccupied = document.getElementById(`${squareX + 1}${squareY + 1}`).children.length > 0;

        if (isSquareOccupied) {
            return false;
        }

        squareX += xDirection;
        squareY += yDirection;
    }
    
    if (isFriendlyPieceOnEndingPosition(endingPosition)) {
        return false;
    } else {
        // enemy piece has been captured
    }

    return true;
}

function isFriendlyPieceOnEndingPosition(endingPosition) {
    const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}`);

    if (destinationSquare.children.length > 0) {
        const destinationPiece = destinationSquare.querySelector('.piece').id;
    
        if (destinationPiece == destinationPiece.toLowerCase() && curPlayer == 'black' ||
            destinationPiece == destinationPiece.toUpperCase() && curPlayer == 'white') {
                return true;
        } else {
            return false;
        }        
    } else {
        return false;
    }
}

function isEnemyPieceOnEndingPosition(endingPosition) {
    const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}`);

    if (destinationSquare.children.length > 0) {
        const destinationPiece = destinationSquare.querySelector('.piece').id;
    
        if (destinationPiece == destinationPiece.toLowerCase() && curPlayer == 'white' ||
            destinationPiece == destinationPiece.toUpperCase() && curPlayer == 'black') {
                return true;
        } else {
            return false;
        }        
    } else {
        return false;
    }
}


function playGame() {
        if (curPlayer == 'white') {
            return;
        }
        const newBoard = new Chessboard(curBoard);
        newBoard.short_castling_black = flags.short_castling_black;
        newBoard.long_castling_black = flags.long_castling_black;
        newBoard.short_castling_white = flags.short_castling_white;
        newBoard.long_castling_white = flags.long_castling_white;

        if (curPlayer == 'white') {
            newBoard.turn = 0;
        } else {
            newBoard.turn = 1;
        }
        
        let best_move = find_best_move(newBoard, 0, -1000000000.0, 1000000000.0);
        let p = best_move.bestMove;

        const pieceElement = document.createElement('img');
        pieceElement.classList.add('piece');
        pieceElement.id = curBoard[7 - p.x1][p.y1];
        pieceElement.draggable = false;
        pieceElement.src = getPieceImageSource(curBoard[7 - p.x1][p.y1]);
    
        movePiece(pieceElement, [7 - p.x1, p.y1], [7 - p.x2, p.y2]);
}

startGame();
setPieceHoldEvents();

setInterval(playGame, 2500);


