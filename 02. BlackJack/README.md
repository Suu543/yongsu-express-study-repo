# Blackjack

```javascript
/*
1. Create a deck of 52 cards
2. Shuffle the deck
3. Ask the Player for their bet
4. Make sure that the Player's bet does not exceed their available chips
5. Deal two cards to the Dealer and two cards to the Player
6. Show only one of the Dealer's cards, the other remains hidden
7. Show both of the Player's cards
8. Ask the Player if they wish to Hit, and take another card
9. If the Player's hand doesn't Bust (go over 21), ask if they'd like to Hit again.
10. If a Player Stands, play the Dealer's hand. The dealer will always Hit until the Dealer's value meets or exceeds 17
11. Determine the winner and adjust the Player's chips accordingly
12. Ask the Player if they'd like to play again
 */

const prompt = require("prompt-sync")({ sigint: true });

const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
const ranks = [
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Jack",
  "Queen",
  "King",
  "Ace",
];

const values = {
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Jack: 10,
  Queen: 10,
  King: 10,
  Ace: 11,
};

let playing = true;

class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  summary() {
    return this.rank + " of " + this.suit;
  }
}

class Deck {
  constructor() {
    this.deck = [];
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < ranks.length; j++) {
        this.deck.push(new Card(suits[i], ranks[j]));
      }
    }
  }

  summary() {
    let deck_comp = "";
    for (let i = 0; i < this.deck.length; i++) {
      deck_comp += "\n " + this.deck[i].summary();
    }

    return "The deck has: " + deck_comp;
  }

  shuffle() {
    // 피셔-예이츠 셔플(Fisher-Yates shuffle)을 활용한 배열 섞기
    // 임의 값을 선점해 값을 하나씩 지우면서 새로운 순서를 정의하는 방법입니다.
    for (let index = this.deck.length - 1; index > 0; index--) {
      // 무작위 index 값을 만든다 (0 이상의 배열 길이 값)
      const randomPosition = Math.floor(Math.random() * (index + 1));

      // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다
      const temporary = this.deck[index];
      this.deck[index] = this.deck[randomPosition];
      this.deck[randomPosition] = temporary;
    }

    // console.log("Deck Length is: ", this.deck.length);
  }

  deal() {
    let single_card = this.deck.pop();
    return single_card;
  }
}

class Hand {
  constructor() {
    this.cards = [];
    this.value = 0;
    this.aces = 0;
  }

  add_card(card) {
    this.cards.push(card);
    this.value += values[card.rank];
  }

  adjust_for_ace() {
    while (this.value > 21 && this.aces) {
      this.value -= 10;
      this.aces -= 1;
    }
  }
}

class Chips {
  constructor() {
    this.total = 100;
    this.bet = 0;
  }

  win_bet() {
    this.total += this.bet;
  }

  lose_bet() {
    this.total -= this.bet;
  }
}

function take_bet(chips) {
  while (true) {
    // 오류 처리는 하지 않음, 입력을 숫자가 아닌 다른거로 입력한 경우
    chips.bet = Number(prompt("How many chips would you like to bet? "));

    if (chips.bet > chips.total) {
      console.log("Sorry your bet can't exceed ", chips.total);
    } else {
      break;
    }
  }
}

function hit(deck, hand) {
  hand.add_card(deck.deal());
  hand.adjust_for_ace();
}

function hit_or_stand(deck, hand) {
  while (true) {
    let x = prompt("Would you like to Hit or Stand? Enter 'h' or 's': ");

    if (x[0].toLowerCase() === "h") {
      hit(deck, hand);
    } else if (x[0].toLowerCase() === "s") {
      console.log("Player stands. Dealer is playing!!!");
      playing = false;
    } else {
      console.log("Sorry, Please Try Again!!!");
      continue;
    }

    break;
  }
}

function show_some(player, dealer) {
  console.log("\nDealer's Hand:");
  console.log(" <card hidden>");
  console.log("", dealer.cards[1]);
  console.log("\nPlayer's Hand");
  console.log("", player.cards[0]);
  console.log("", player.cards[1]);
}

function show_all(player, dealer) {
  console.log("Dealer's Hand =", dealer.value);
  console.log("", dealer.cards[0]);
  console.log("", dealer.cards[1]);

  console.log("Player's Hand =", player.value);
  console.log("", player.cards[0]);
  console.log("", player.cards[1]);
}

function player_busts(player, dealer, chips) {
  console.log("Player busts!");
  chips.lose_bet();
}

function player_wins(player, dealer, chips) {
  console.log("Player wins!");
  chips.win_bet();
}

function dealer_busts(player, dealer, chips) {
  console.log("Dealer busts!");
  chips.win_bet();
}

function dealer_wins(player, dealer, chips) {
  console.log("Dealer wins!");
  chips.lose_bet();
}

function push(player, dealer) {
  console.log("Dealer and Player tie! It's a push.");
}

function run() {
  while (true) {
    //Print an opening statement
    console.log(
      "Welcome to BlackJack! Get as close to 21 as you can without going over!\n\
    Dealer hits until she reaches 17. Aces count as 1 or 11."
    );

    // Create & shuffle the deck, deal two cards to each player
    let deck = new Deck();
    deck.shuffle();

    let player_hand = new Hand();
    player_hand.add_card(deck.deal());
    player_hand.add_card(deck.deal());

    let dealer_hand = new Hand();
    dealer_hand.add_card(deck.deal());
    dealer_hand.add_card(deck.deal());

    // Set up the Player's chips
    let player_chips = new Chips();

    // Prompt the Player for their bet
    take_bet(player_chips);

    // Show cards (but keep one dealer card hidden)
    show_some(player_hand, dealer_hand);

    // recall this variable from our hit_or_stand function
    while (playing) {
      // Prompt for Player to Hit or Stand
      hit_or_stand(deck, player_hand);

      // Show cards (but keep one dealer card hidden)
      show_some(player_hand, dealer_hand);

      // If player's hand exceeds 21, run player_busts() and break out of loop
      if (player_hand.value > 21) {
        player_busts(player_hand, dealer_hand, player_chips);
        break;
      }
    }

    // If Player hasn't busted, play Dealer's hand until Dealer reaches 17
    if (player_hand.value <= 21) {
      while (dealer_hand.value < 17) {
        hit(deck, dealer_hand);
      }

      // Show all cards
      show_all(player_hand, dealer_hand);

      // Run different winning scenarios
      if (dealer_hand.value > 21) {
        dealer_busts(player_hand, dealer_hand, player_chips);
      } else if (dealer_hand.value > player_hand.value) {
        dealer_wins(player_hand, dealer_hand, player_chips);
      } else if (dealer_hand.value < player_hand.value) {
        player_wins(player_hand, dealer_hand, player_chips);
      } else {
        push(player_hand, dealer_hand);
      }

      // Inform Player of their chips total
      console.log("\nPlayer's winnings stand at", player_chips.total);

      // Ask to play again
      new_game = prompt(
        "Would you like to play another hand? Enter 'y' or 'n' "
      );

      if (new_game[0].toLowerCase() == "y") {
        playing = true;
        continue;
      } else {
        console.log("Thanks for playing!");
        break;
      }
    }
  }
}

run();
```