# Tic-Tac-Toe

```javascript
const prompt = require("prompt-sync")({ sigint: true });

function display_board(board) {
  console.clear();

  console.log("   |   |");
  console.log(" " + board[7] + " | " + board[8] + " | " + board[9]);
  console.log("   |   |");
  console.log("-----------");
  console.log("   |   |");
  console.log(" " + board[4] + " | " + board[5] + " | " + board[6]);
  console.log("   |   |");
  console.log("-----------");
  console.log("   |   |");
  console.log(" " + board[1] + " | " + board[2] + " | " + board[3]);
  console.log("   |   |");
}

function player_input() {
  let marker = "";

  while (marker !== "X" || marker !== "O") {
    marker = prompt("Player 1: Do you want to be X or O: ").toUpperCase();

    if (marker === "X") {
      return ["X", "O"];
    } else {
      return ["O", "X"];
    }
  }
}

function place_marker(board, marker, position) {
  board[position] = marker;
}

function win_check(board, marker) {
  return (
    (board[7] === marker && board[8] === marker && board[9] === marker) ||
    (board[4] === marker && board[5] === marker && board[6] === marker) ||
    (board[1] === marker && board[2] === marker && board[3] === marker) ||
    (board[7] === marker && board[4] === marker && board[1] === marker) ||
    (board[8] === marker && board[5] === marker && board[2] === marker) ||
    (board[9] === marker && board[6] === marker && board[3] === marker) ||
    (board[7] === marker && board[5] === marker && board[3] === marker) ||
    (board[9] === marker && board[5] === marker && board[1] === marker)
  );
}

function choose_first() {
  let order = Math.random() < 0.5 ? 0 : 1;

  if (order === 0) {
    return "Player 2";
  } else {
    return "Player 1";
  }
}

function space_check(board, position) {
  return board[position] === " ";
}

function full_board_check(board) {
  for (let i = 1; i < 10; i++) {
    if (space_check(board, i)) {
      return false;
    }
  }

  return true;
}

function player_choice(board) {
  let position = 0;
  let possible_positions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  while (
    !possible_positions.includes(position) ||
    !space_check(board, position)
  ) {
    position = Number(prompt("Choose Your Next Position (1 ~ 9): "));
    console.log(position);
  }

  return Number(position);
}

function replay() {
  return prompt("Do you want to play again? Yes or No: ")
    .toLowerCase()
    .startsWith("y");
}

function run() {
  console.log("Welcome to Tic Tac Toe!!!!!!!");

  while (true) {
    let position = "";
    let game_on = false;
    let theBoard = Array(10).fill(" ");
    let markers = player_input();
    let player1_marker = markers[0];
    let player2_marker = markers[1];

    let turn = choose_first();
    console.log(turn + " will go first!");

    let play_game = prompt("Are you ready to play? Enter Yes or No: ");

    if (play_game.toLowerCase()[0] === "y") {
      game_on = true;
    } else {
      game_on = false;
    }

    while (game_on) {
      if (turn === "Player 1") {
        display_board(theBoard);
        position = player_choice(theBoard);
        place_marker(theBoard, player1_marker, position);

        if (win_check(theBoard, player1_marker)) {
          display_board(theBoard);
          console.log("Congratulations! Player 1 have won the game!");
          game_on = false;
        } else {
          if (full_board_check(theBoard)) {
            display_board(theBoard);
            console.log("The game is draw!");
            break;
          } else {
            turn = "Player 2";
          }
        }
      } else {
        // Player2's turn
        display_board(theBoard);
        position = player_choice(theBoard);
        place_marker(theBoard, player2_marker, position);

        if (win_check(theBoard, player2_marker)) {
          display_board(theBoard);
          console.log("Congratulations! Player 2 have won the game!");
          game_on = false;
        } else {
          if (full_board_check(theBoard)) {
            display_board(theBoard);
            console.log("The game is a draw!");
            game_on = false;
          } else {
            turn = "Player 1";
          }
        }
      }
    }

    if (!replay()) {
      console.log("Thanks for joining us...");
      console.log("Bye Bye!!");
      break;
    }
  }
}

run();
```