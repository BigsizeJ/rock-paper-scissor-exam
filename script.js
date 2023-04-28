const pvpBtn = document.querySelector("#pvpBtn");
const pvcBtn = document.querySelector("#pvcBtn");
const playAgain = document.querySelector("#play-again");
const returnSelect = document.querySelector("#return");
const SelectBox = document.querySelector("#select-mode");
const PVP = document.querySelector("#pvp");
const modal = document.querySelector(".modal");

const Type = { PVP: "pvp", PVC: "pvc" };
const Player = { One: "Player 1", Two: "Player 2" };
let gameMode = "";
const Game = () => {
  const Mode = (type) => {
    const player1Score = parseInt(
      document.querySelector("#p1-score").textContent
    );
    const player2Score = parseInt(
      document.querySelector("#p2-score").textContent
    );
    const comScore = 0;

    type === Type.PVP
      ? TwoPlayerLoop(player1Score, player2Score)
      : VersusComputerLoop(player1Score, comScore);
  };

  const DisableButton = (player) => {
    if (player === Player.One) {
      const p1Btn = document.querySelectorAll("#p1Btn");
      p1Btn.forEach((btn) => {
        btn.disabled = true;
      });
    }
    if (player === Player.Two) {
      const p2Btn = document.querySelectorAll("#p2Btn");
      p2Btn.forEach((btn) => {
        btn.disabled = true;
      });
    }
  };

  const EnableButton = () => {
    const p1Btn = document.querySelectorAll("#p1Btn");
    p1Btn.forEach((btn) => {
      btn.disabled = false;
    });
    const p2Btn = document.querySelectorAll("#p2Btn");
    p2Btn.forEach((btn) => {
      btn.disabled = false;
    });
  };

  // Promise
  const Turn = (player) => {
    if (gameMode === Type.PVP) UpdateDisplay(player);
    EnableButton();
    return new Promise((res, rej) => {
      if (player === Player.One) {
        const p1Btn = document.querySelectorAll("#p1Btn");
        DisableButton(Player.Two);
        p1Btn.forEach((btn) => {
          btn.addEventListener("click", () => {
            return res(btn.dataset.value);
          });
        });
      } else {
        const p2Btn = document.querySelectorAll("#p2Btn");
        DisableButton(Player.One);
        p2Btn.forEach((btn) => {
          btn.addEventListener("click", () => {
            return res(btn.dataset.value);
          });
        });
      }
    });
  };

  const UpdateDisplay = (player) => {
    const Turn = document.querySelector("#turn");
    if (player === Player.One) {
      Turn.innerText = `${player} turn`;
    }
    if (player === Player.Two) {
      Turn.innerText = `${player} turn`;
    }
  };

  const UpdateScore = (player) => {
    const p1Score = document.querySelector("#p1-score");
    const p2Score = document.querySelector("#p2-score");
    if (player === Player.One)
      return (p1Score.textContent = parseInt(p1Score.textContent) + 1);
    if (player === Player.Two || player === "Computer")
      return (p2Score.textContent = parseInt(p2Score.textContent) + 1);
    return;
  };

  const CheckRoundWinner = (blueChoice, redChoice) => {
    if (blueChoice === "rock" && redChoice === "scissor") return Player.One;
    if (blueChoice === "paper" && redChoice === "rock") return Player.One;
    if (blueChoice === "scissor" && redChoice === "paper") return Player.One;
    if (blueChoice === redChoice) return "tie";
    return gameMode === Type.PVP ? Player.Two : "Computer";
  };

  const CheckWinner = (blue, red, gameStatus) => {
    if (blue.score >= 5)
      return { ...gameStatus, theresWinner: true, winner: Player.One };
    if (red.score >= 5 && gameMode === Type.PVP)
      return { ...gameStatus, theresWinner: true, winner: Player.Two };
    if (red.score >= 5 && gameMode === Type.PVC)
      return { ...gameStatus, theresWinner: true, winner: "Computer" };
    return gameStatus;
  };

  const GameEnded = (winner) => {
    const winnerDisplay = document.querySelector("#winner");
    modal.style.cssText = `display: flex;`;

    winnerDisplay.innerText = `${winner} Win!`;
  };

  const PlayAgain = (gameMode) => {
    const winnerDisplay = document.querySelector("#winner");
    winnerDisplay.innerText = "";
    modal.style.display = "none";

    const player1Score = document.querySelector("#p1-score");
    const player2Score = document.querySelector("#p2-score");

    player1Score.innerText = 0;
    player2Score.innerText = 0;
    Mode(gameMode);
  };

  const TwoPlayerLoop = async (blueScore, redScore) => {
    let playerTurn = Player.One;

    const blue = { choice: "", score: blueScore };
    const red = { choice: "", score: redScore };

    let gameStatus = { theresWinner: false, winner: "" };

    while (!gameStatus.theresWinner) {
      const choice = await Turn(playerTurn);
      if (playerTurn === Player.One) {
        playerTurn = Player.Two;
        blue.choice = choice;
      } else {
        playerTurn = Player.One;
        red.choice = choice;
      }
      if (red.choice == "") {
        continue;
      } else {
        const winner = CheckRoundWinner(blue.choice, red.choice);
        winner === Player.One ? blue.score++ : red.score++;

        gameStatus = CheckWinner(blue, red, gameStatus);
        UpdateScore(winner);
        blue.choice = "";
        red.choice = "";
      }
    }
    GameEnded(gameStatus.winner);
  };

  const ComputerChoice = () => {
    const arg = ["rock", "paper", "scissor"];
    const random = Math.floor(Math.random() * arg.length);

    return arg[random];
  };

  const ComputerGuideWinner = (red) => {
    const Turn = document.querySelector("#turn");

    Turn.innerText = `Computer choose ${red.choice}`;
  };

  const VersusComputerLoop = async (blueScore, redScore) => {
    let playerTurn = Player.One;

    const blue = { choice: "", score: blueScore };
    const red = { choice: "", score: redScore };

    let gameStatus = { theresWinner: false, winner: "" };

    while (!gameStatus.theresWinner) {
      blue.choice = await Turn(playerTurn);
      red.choice = ComputerChoice();

      const winner = CheckRoundWinner(blue.choice, red.choice);
      winner === Player.One ? blue.score++ : red.score++;
      gameStatus = CheckWinner(blue, red, gameStatus);
      UpdateScore(winner);
      ComputerGuideWinner(red);
      blue.choice = "";
      red.choice = "";
    }
    GameEnded(gameStatus.winner);
  };
  return { Mode, PlayAgain };
};

const SlideStart = () => {
  SelectBox.style.margin = "0 0 0 1000px ";
  SelectBox.style.opacity = "0";

  PVP.style.cssText = `pointer-events: all; margin: 0; opacity:1`;

  PVP.animate([{ margin: "0 1000px 0 0" }, { opacity: "1" }], {
    duration: 1000,
  });
};

pvpBtn.addEventListener("click", () => {
  SlideStart();
  gameMode = Type.PVP;
  Game().Mode(gameMode);
});

pvcBtn.addEventListener("click", () => {
  SlideStart();
  const changeName = document.querySelector("#change-name");
  changeName.innerText = "Computer";
  gameMode = Type.PVC;
  Game().Mode(gameMode);
});

playAgain.addEventListener("click", () => {
  const { PlayAgain } = Game();
  PlayAgain(gameMode);
});

returnSelect.addEventListener("click", () => {
  modal.style.display = "none";
  const player1Score = document.querySelector("#p1-score");
  const player2Score = document.querySelector("#p2-score");

  player1Score.innerText = 0;
  player2Score.innerText = 0;

  SelectBox.style.margin = "0 ";
  SelectBox.style.opacity = "1";

  PVP.style.cssText = `pointer-events: none; margin-right: 1000px; opacity:0`;
  PVP.animate([{ margin: "0 0 0 1000px" }, { opacity: "0" }], {
    duration: 1000,
  });
});
