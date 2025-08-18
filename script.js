let money = 5000;
let spinCost = 10;
let prizeAmount = 10;
let autoSpinEnabled = false;
let totalSpins = 0;
let BASE_SPIN_COST = 10;

let onLoan = false;
let loanRepayment = 500;

let prizeStats = {
  jackpotsUnlocked: 0,
  twoPairsUnlocked: 0,
}
let prizes = calculatePrizes();
function calculatePrizes() {
  return {
    jackpot: spinCost * 50,
    twoPair: spinCost * 2,
  }
}
let slotDisplay = {
  slot1: document.querySelector('.slot-one'),
  slot2: document.querySelector('.slot-two'),
  slot3: document.querySelector('.slot-three')
}
let slotHandle = document.querySelector('.slot-handle');
let slotStats = {
  terminal: document.querySelector('.terminal'),
  money: document.querySelector('.money'),
  spinCost: document.querySelector('.spin-cost')
}
const sfx = {
  spin: new Audio('./assets/sounds/spin.mp3'),
  jackpot: new Audio('./assets/sounds/jackpot.mp3'),
  twoPair: new Audio('./assets/sounds/two-pair.mp3'),
  spinning: new Audio('./assets/sounds/spinning.mp3'),
  slotLoad: new Audio('./assets/sounds/slot-load.mp3'),
  win: new Audio('./assets/sounds/win.mp3'),
  lose: new Audio('./assets/sounds/lose.mp3'),
  click: new Audio('./assets/sounds/click.mp3'),
}

function moneyFormat(num) {
  return num.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

slotHandle.addEventListener('click', spin);
let symbols = ['🍋', '🪙', '🥭', '🔔', '🍉', '⭐', '🍇', '🎰', '👑', '💰', '💵', '🍀', '🥇', '🥈', '🥉', '🍒', '💎', '7️⃣'];
function spin() {
  if (!autoSpinEnabled) {
    slotHandle.removeEventListener('click', spin);
    slotHandle.style.cursor = 'default';
  } else if (autoSpinEnabled) {playSound(sfx.click);}
  if (money < spinCost) {
    slotStats.terminal.textContent = "Not enough money to spin!";
    alert("You don't have enough money to spin.");
    slotHandle.addEventListener('click', spin);
    slotHandle.style.cursor = 'pointer';
    return;
  }
  playSound(sfx.spin);
  money -= spinCost;
  slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
  slotHandle.style.animation = 'spin 1s ease-in-out';
  slotStats.terminal.textContent = "Spinning...";
  totalSpins++;
  slotNumbers = [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      if (i%2 == 0) {playSound(sfx.spinning);}
      if (i == 28 || i == 22 || i == 16) {playSound(sfx.slotLoad);}
      slotDisplay.slot1.textContent = i < 17 ? symbols[i % symbols.length] : slotNumbers[0];
      slotDisplay.slot2.textContent = i < 23 ? symbols[(i + 1) % symbols.length] : slotNumbers[1];
      slotDisplay.slot3.textContent = i < 29 ? symbols[(i + 2) % symbols.length] : slotNumbers[2];
    }, i * 50);
  }
  setTimeout(() => {
    slotHandle.style.animation = '';
    if (!autoSpinEnabled) {
      slotHandle.addEventListener('click', spin);
      slotHandle.style.cursor = 'pointer';
    }
    if (slotNumbers[0] === slotNumbers[1] && slotNumbers[1] === slotNumbers[2]) {
      money += prizes.jackpot;
      playSound(sfx.jackpot);
      prizeStats.jackpotsUnlocked++;
      slotStats.terminal.textContent = `Jackpot! You won $${moneyFormat(prizes.jackpot)}!`;
      slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
      multiplierButtons.forEach((button, index) => {
        if (jackpotRequirement[index] == prizeStats.jackpotsUnlocked) {
          button.disabled = false;
        }
      });
    }
    else if (slotNumbers[0] === slotNumbers[1] || slotNumbers[1] === slotNumbers[2] || slotNumbers[0] === slotNumbers[2]) {
      money += prizes.twoPair;
      playSound(sfx.twoPair);
      prizeStats.twoPairsUnlocked++;
      slotStats.terminal.textContent = `You won $${moneyFormat(prizes.twoPair)}!`;
      slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
      sidebarButtons.forEach((button, index) => {
        if (twoPairRequirements[index] == prizeStats.twoPairsUnlocked) {
          button.disabled = false;
        }
      });
    }
    else {
      slotStats.terminal.textContent = "Sorry, you didn't win.";
    }
    if (!autoSpinEnabled) {setTimeout(checkGameOver, 1000);}
  }, 1600);
}

let gameOverScreenShown = false;
function checkGameOver() {
  if (!gameOverScreenShown) {
    if ((onLoan && loanRepayment == 1000) || (onLoan && money <= BASE_SPIN_COST)) {
      setTimeout(() => {alert("You failed to repay your loan I see.");}, 500);
      setTimeout(() => {
        document.querySelector('.game-over-screen.with-loan').style.display = 'flex';
        playSound(sfx.lose);
      }, 1000);
    } else if (money <= BASE_SPIN_COST) {
      setTimeout(() => {alert("You've ran out of money I see.");}, 500);
      setTimeout(() => {
        document.querySelector('.game-over-screen.without-loan').style.display = 'flex';
        playSound(sfx.lose);
      }, 1000);
    } else if (money >= 100000 /* More conditions whenever upgrades and more are added */) {
      setTimeout(() => {alert("You've done a lot I see.");}, 500);
      setTimeout(() => {
        document.querySelector('.game-over-screen.game-won').style.display = 'flex';
        playSound(sfx.win);
        gameOverScreenShown = true;
      }, 1000);
    }
  }
}

let twoPairRequirements = [1, 5, 10, 20, 50, 75, 100, 250, 0, 0];
let sidebarButtons = document.querySelectorAll('.sidebar-btn');
let sidebarDivs = document.querySelectorAll('.sidebar-div');
let sidebarCloseButtons = document.querySelectorAll('.close');
let autoSpinInterval;

sidebarButtons.forEach((button, index) => {
  if (index != 0) {
    button.addEventListener('click', () => {
      playSound(sfx.click);
      sidebarDivs.forEach((div) => {
        if (div !== sidebarDivs.item(index) && div !== sidebarDivs.item(0)) {
          div.classList.remove('shown');
        }
      });
      sidebarDivs.item(index).classList.toggle('shown');
      sidebarButtons.forEach((btn, btnIndex) => {
        if (btnIndex !== index && btnIndex !== 0) {
          btn.classList.remove('selected');
        }
      });
      button.classList.toggle('selected');
    });
  } else {
    button.addEventListener('click', () => {
      sidebarButtons.forEach((btn, btnIndex) => {
        if (btnIndex != 0) {
          btn.classList.remove('selected');
        }
      });
      button.classList.toggle('selected');
      sidebarDivs.item(0).classList.toggle('shown');
      autoSpinEnabled = !autoSpinEnabled;
      
      if (autoSpinEnabled) {
        spin();
        autoSpinInterval = setInterval(() => {
          if (money >= spinCost) {
            document.querySelector('.auto-spin').style.animation = 'click 0.3s ease-in-out';
            setTimeout(() => {
              document.querySelector('.auto-spin').style.animation = '';
            }, 350);
            spin();
          } else {
            clearInterval(autoSpinInterval);
            autoSpinEnabled = false;
            button.classList.remove('selected');
            sidebarDivs.item(0).classList.toggle('shown');
            checkGameOver();
          }
        }, 1750); // Wait 2 seconds between spins
      } else {
        clearInterval(autoSpinInterval);
      }
    });
  }
});
sidebarCloseButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    playSound(sfx.click);
    sidebarDivs.item(index + 1).classList.remove('shown');
    sidebarButtons[index + 1].classList.remove('selected');
  });
});

let jackpotRequirement = [0, 1, 10, 100];
let multiplierButtons = document.querySelectorAll('.multiplier-btns');
let multiplierAmounts = [10, 100, 1000, 10000];
let spinCostAmounts = [10, 100, 1000, 10000];
let colorClasses = ['one', 'ten', 'hundred', 'thousand'];
let slotMachineHolder = document.querySelector('.slot-machine-holder');

multiplierButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    playSound(sfx.click);
    spinCost = spinCostAmounts[index];
    prizeAmount = multiplierAmounts[index];
    prizes = calculatePrizes();
    slotStats.spinCost.textContent = `Spin Cost: $${moneyFormat(spinCost)}`;
    colorClasses.forEach((colorClass, index) => {
      slotMachineHolder.classList.remove([colorClass]);
    });
    multiplierButtons.forEach((btn, btnIndex) => {
      btn.classList.remove('selected');
    });
    slotMachineHolder.classList.add(colorClasses[index]);
    button.classList.add('selected');
  });
});

let tutorialDiv = document.querySelector('.tutorial');
let startTutorialButton = document.querySelector('.tutorial-start');
let nextTutorialButton = document.querySelector('.next-tutorial');
let closeTutorial = document.querySelectorAll('.close-tutorial');
let currentTutorialStep = 0;
let tutorialStepClasses = ['first-section', 'second-section', 'third-section', 'fourth-section', 'fifth-section'];
let tutorialText = ["Welcome to Slots City! To start, click the handle to spin!", "View your Money and Spin Cost below the display", "Once you start getting Two Pairs, more features will be unlocked!", "Once you start getting Jackpots, you can unlock multipliers!", "Lastly, to view how much progress you've made, check out the achievements."];

function initializeTutorial() {
  nextTutorialButton.focus();
  tutorialStepClasses.forEach((cls) => {tutorialDiv.classList.remove(cls);});
  tutorialDiv.classList.add(tutorialStepClasses[currentTutorialStep]);
  tutorialDiv.querySelector('p').textContent = tutorialText[currentTutorialStep];
}
startTutorialButton.addEventListener('click', () => {
  currentTutorialStep = 0;
  initializeTutorial();
});
nextTutorialButton.addEventListener('click', () => {
  currentTutorialStep++;
  initializeTutorial();
  if (currentTutorialStep === 6) {
    tutorialStepClasses.forEach((cls) => {tutorialDiv.classList.remove(cls);});
  }
});
closeTutorial.forEach((button) => {
  button.addEventListener('click', () => {
    tutorialStepClasses.forEach((cls) => {tutorialDiv.classList.remove(cls);});
  });
});

let muteBtn = document.querySelector('.mute');
let soundsMuted = false;
function playSound(audioSource) {
  if (!soundsMuted) {
    const sound = audioSource.cloneNode();
    sound.play();
  }
}
muteBtn.addEventListener('click', () => {
  soundsMuted = !soundsMuted;
  muteBtn.textContent = soundsMuted ? 'Unmute' : 'Mute';
});
