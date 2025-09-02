let money = 5000;
let spinCost = 10;
let prizeAmount = 10;
let autoSpinEnabled = false;
let BASE_SPIN_COST = 10;

let onLoan = false;
let loanRepayment = 500;

let gameStats = {
  jackpotsUnlocked: 0,
  twoPairsUnlocked: 0,
  actualJackpots: 0,
  actualTwoPairs: 0,
  totalSpins: 0,
  achievementsUnlocked: 0,
  luckPercentage: 0,
  prizes: calculatePrizes(),
  spinBonus: 0,
  businessBonus: 0,
  totalPrestiges: 0,
  prestigeMultiplier: 1,
}
function calculatePrizes() {
  return {
    jackpot: prizeAmount * 50,
    twoPair: prizeAmount * 2,
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
  upgrade: new Audio('./assets/sounds/upgrade.mp3'),
  background: new Audio('./assets/sounds/background.mp3'),
  trophy: new Audio('./assets/sounds/trophy.mp3'),
  takeLoan: new Audio('./assets/sounds/take-loan.mp3'),
  payLoan: new Audio('./assets/sounds/pay-loan.mp3'),
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
  onLoan ? loanRepayment += 5 : null;
  playSound(sfx.spin);
  money -= (spinCost - gameStats.spinBonus);
  slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
  slotHandle.style.animation = 'spin 1s ease-in-out';
  slotStats.terminal.textContent = "Spinning...";
  gameStats.totalSpins++;
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
      money += gameStats.prizes.jackpot;
      playSound(sfx.jackpot);
      gameStats.jackpotsUnlocked++;
      gameStats.actualJackpots++;
      slotStats.terminal.textContent = `Jackpot! You won $${moneyFormat(gameStats.prizes.jackpot)}!`;
      slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
      multiplierButtons.forEach((button, index) => {
        if (jackpotRequirement[index] == gameStats.jackpotsUnlocked) {
          button.disabled = false;
        }
      });
    }
    else if (slotNumbers[0] === slotNumbers[1] || slotNumbers[1] === slotNumbers[2] || slotNumbers[0] === slotNumbers[2]) {
      money += gameStats.prizes.twoPair;
      playSound(sfx.twoPair);
      gameStats.twoPairsUnlocked++;
      gameStats.actualTwoPairs++;
      slotStats.terminal.textContent = `You won $${moneyFormat(gameStats.prizes.twoPair)}!`;
      slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
      sidebarButtons.forEach((button, index) => {
        if (twoPairRequirements[index] == gameStats.twoPairsUnlocked) {
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
    if ((onLoan && loanRepayment == 1005) || (onLoan && money <= BASE_SPIN_COST - gameStats.spinBonus)) {
      setTimeout(() => {alert("You failed to repay your loan I see.");}, 500);
      setTimeout(() => {
        document.querySelector('.game-over-screen.with-loan').style.display = 'flex';
        playSound(sfx.lose);
      }, 1000);
    } else if (gameStats.twoPairsUnlocked < 50 && money <= BASE_SPIN_COST - gameStats.spinBonus) {
      setTimeout(() => {alert("You failed to take a loan I see.");}, 500);
      setTimeout(() => {
        document.querySelector('.game-over-screen.with-loan').style.display = 'flex';
        playSound(sfx.lose);
      }, 1000);
    } else if (money <= BASE_SPIN_COST - gameStats.spinBonus) {
      setTimeout(() => {alert("You've ran out of money I see.");}, 500);
      setTimeout(() => {
        document.querySelector('.game-over-screen.without-loan').style.display = 'flex';
        playSound(sfx.lose);
      }, 1000);
    } else if (money >= 1000000 /* More conditions whenever upgrades and more are added */) {
      // setTimeout(() => {alert("You've done a lot I see.");}, 500);
      setTimeout(() => {alert("Feature not ready, you just have a lot of money.");}, 500);
      setTimeout(() => {
        document.querySelector('.game-over-screen.game-won').style.display = 'flex';
        playSound(sfx.win);
        gameOverScreenShown = true;
      }, 1000);
    }
  }
}
let continueBtn = document.querySelector('.continue');
continueBtn.addEventListener('click', () => {
  document.querySelector('.game-over-screen.game-won').style.display = 'none';
});

let upgradeDivs = document.querySelectorAll('.upgrade-container');
let upgradePrices = [500, 400, 300];
let priceIncrements = [100, 80, 60];
let upgradeFunctions = [increaseLuck, increaseIncome, increaseSpinBonus];
let upgradeLevels = [0, 0, 0];
upgradeDivs.forEach((div, index) => {
  div.querySelector('button').addEventListener('click', () => {
    if (money >= upgradePrices[index] && BASE_SPIN_COST == 10) {
      playSound(sfx.upgrade);
      money -= upgradePrices[index];
      upgradeFunctions[index](div, index);
      upgradeLevels[index]++;
      if (upgradeLevels[index] == 15) {
        div.querySelector('span').textContent = `${upgradeLevels[index]} (MAX LEVEL)`;
        div.querySelector('button').disabled = true;
      } else {div.querySelector('span').textContent = `${upgradeLevels[index]} -> ${upgradeLevels[index] + 1}`;}
      upgradePrices[index] += priceIncrements[index];
      div.querySelector('button').textContent = `$${upgradePrices[index]}`;
      slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
    } else if (BASE_SPIN_COST != 10) {
      alert("Upgrades not available for higher multipliers.");
    } else {
      alert("You do not have enough money to purchase this upgrade.");
    }
  });
});

function increaseLuck(div, index) {
  gameStats.luckPercentage += 100/15;
  symbols.pop();
}
function increaseIncome(div, index) {
  prizeAmount += 1;
  gameStats.prizes = calculatePrizes();
}
function increaseSpinBonus(div, index) {
  gameStats.spinBonus += 0.5;
  slotStats.spinCost.textContent = `Spin Cost: $${moneyFormat(spinCost - gameStats.spinBonus)}`;
}

function takeLoan() {
  onLoan = true;
  money += 500;
  slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
  takeLoanBtn.disabled = true;
  payLoanBtn.disabled = false;
  playSound(sfx.takeLoan);
  loanThings();
}
let takeLoanBtn = document.querySelector('.take-loan');
takeLoanBtn.addEventListener('click', takeLoan);
let payLoanBtn = document.querySelector('.pay-loan');
payLoanBtn.addEventListener('click', () => {
  if (money >= loanRepayment) {
    money -= loanRepayment;
    slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
    onLoan = false;
    loanRepayment = 500;
    takeLoanBtn.disabled = false;
    payLoanBtn.disabled = true;
    playSound(sfx.payLoan);
    loanThings();
    checkGameOver();
  } else {
    alert("You do not have enough money to repay your loan.");
  }
});
let takeLoanGameOver = document.querySelector('.take-loan-game-over');
takeLoanGameOver.addEventListener('click', () => {
  playSound(sfx.click);
  document.querySelector('.game-over-screen.without-loan').style.display = 'none';
  takeLoan();
});

let repaymentLabel = document.querySelector('.repayment');
function loanThings() {
  repaymentLabel.textContent = moneyFormat(onLoan ? loanRepayment : 0);
}

let twoPairRequirements = [1, 5, 10, 20, 50, 75, 100, 250, 0, 0];
let sidebarButtons = document.querySelectorAll('.sidebar-btn');
let sidebarDivs = document.querySelectorAll('.sidebar-div');
let sidebarCloseButtons = document.querySelectorAll('.close');
let sidebarFunctions = [autoSpin, placeholder, placeholder, placeholder, loanThings, placeholder, placeholder, placeholder, updateStats, placeholder, placeholder];
let autoSpinInterval;
function placeholder() {return;}

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
      if (sidebarDivs.item(index).classList.contains('shown')) {
        sidebarFunctions[index]();
      }
    });
  } else {
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
      sidebarDivs.item(0).classList.toggle('shown');
      autoSpinEnabled = !autoSpinEnabled;
      autoSpin();
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

function autoSpin() {
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
}
let mainStats = document.querySelectorAll('.main-stats span');
let upgradeStats = document.querySelectorAll('.upgrade-stats span');
function updateStats() {
  mainStats[0].textContent = gameStats.totalSpins;
  mainStats[1].textContent = gameStats.twoPairsUnlocked;
  mainStats[2].textContent = gameStats.actualTwoPairs;
  mainStats[3].textContent = gameStats.jackpotsUnlocked;
  mainStats[4].textContent = gameStats.actualJackpots;
  mainStats[5].textContent = gameStats.achievementsUnlocked;
  mainStats[6].textContent = gameStats.totalPrestiges;

  upgradeStats[0].textContent = moneyFormat(gameStats.luckPercentage);
  upgradeStats[1].textContent = moneyFormat(gameStats.prizes.twoPair)
  upgradeStats[2].textContent = moneyFormat(gameStats.prizes.jackpot);
  upgradeStats[3].textContent = moneyFormat(gameStats.spinBonus);
  upgradeStats[4].textContent = moneyFormat(gameStats.businessBonus);
  upgradeStats[5].textContent = gameStats.prestigeMultiplier;
}

let jackpotRequirement = [0, 1, 10, 100];
let multiplierButtons = document.querySelectorAll('.multiplier-btns');
let multiplierAmounts = [10, 100, 1000, 10000];
let spinCostAmounts = [10, 100, 1000, 10000];
let colorClasses = ['one', 'ten', 'hundred', 'thousand'];
let slotMachineHolder = document.querySelector('.slot-machine-holder');

// Update the multiplier button event listener
multiplierButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    playSound(sfx.click);
    spinCost = spinCostAmounts[index];
    prizeAmount = multiplierAmounts[index];
    BASE_SPIN_COST = spinCostAmounts[index];
    
    // Add this section to scale the spin bonus with multiplier
    let multiplier = spinCostAmounts[index] / 10; // Calculate multiplier (10, 100, 1000, 10000)
    gameStats.spinBonus = gameStats.spinBonus * multiplier / (spinCostAmounts[currentMultiplier] / 10);
    
    gameStats.prizes = calculatePrizes();
    slotStats.spinCost.textContent = `Spin Cost: $${moneyFormat(spinCost - gameStats.spinBonus)}`;
    
    colorClasses.forEach((colorClass) => {
      slotMachineHolder.classList.remove(colorClass);
    });
    multiplierButtons.forEach((btn) => {
      btn.classList.remove('selected');
    });
    slotMachineHolder.classList.add(colorClasses[index]);
    button.classList.add('selected');
    currentMultiplier = index; // Track current multiplier
  });
});

// Add this variable at the top with other variables
let currentMultiplier = 0;

let themeButtons = document.querySelectorAll('.theme-box');
let themeClasses = ['black', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'color-a', 'color-b', 'color-c', 'color-d', 'red-to-purple', 'teal-to-blue', 'forest-to-green', 'good-theme-a', 'good-theme-b', 'horizen', 'sunset', 'stary-night', 'cyberpunk', 'neon', 'lb-bg-one', 'lb-bg-two', 'lb-bg-three', 'lb-bg-four', 'lb-bg-five'];
let themeCost = [0,0,0,0,0,0,0,0,1000,1000,1000,1000,5000,5000,5000,10000,10000,25000,50000,100000,250000,500000,'Lootbox','Lootbox','Lootbox','Lootbox','Lootbox'];
let unlockedThemes = [true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
let currentTheme = 'blue';
themeButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (unlockedThemes[index]) {
      playSound(sfx.click);
      document.body.classList.remove(currentTheme);
      themeButtons[themeClasses.indexOf(currentTheme)].classList.remove('selected');
      themeButtons[themeClasses.indexOf(currentTheme)].querySelector('span').textContent = 'Use';
      currentTheme = themeClasses[index];
      document.body.classList.add(currentTheme);
      button.classList.add('selected');
      button.querySelector('span').textContent = 'Selected';
    } else if (themeCost[index] == "Lootbox") {
      alert("You haven't unlocked this theme yet. Please open lootboxes to unlock.")
    } else if (money >= themeCost[index]) {
      if (confirm(`Are you sure you want to unlock this theme for $${moneyFormat(themeCost[index])}?`)) {
        playSound(sfx.background);
        money -= themeCost[index];
        slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
        unlockedThemes[index] = true;
        document.body.classList.remove(currentTheme);
        themeButtons[themeClasses.indexOf(currentTheme)].classList.remove('selected');
        themeButtons[themeClasses.indexOf(currentTheme)].querySelector('span').textContent = 'Use';
        currentTheme = themeClasses[index];
        document.body.classList.add(currentTheme);
        button.classList.add('selected');
        button.querySelector('span').textContent = 'Selected';
        checkGameOver();
      }
    } else {
      alert("You do not have enough money to unlock this theme.")
    }
  });
});

let trophyBoxes = document.querySelectorAll('.trophy-box');
let trophyPrices = [10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];
trophyBoxes.forEach((box, index) => {
  box.querySelector('button').addEventListener('click', () => {
    if (money >= trophyPrices[index]) {
      if (confirm(`Are you sure you want to buy this trophy for $${moneyFormat(trophyPrices[index])}?`)) {
        playSound(sfx.trophy);
        money -= trophyPrices[index];
        slotStats.money.textContent = `Money: $${moneyFormat(money)}`;
        box.querySelector('button').textContent = 'Purchased';
        box.querySelector('button').disabled = true;
        checkGameOver();
      }
    } else {
      alert("You do not have enough money to purchase this trophy.");
    }
  });
});

let tutorialDiv = document.querySelector('.tutorial');
let startTutorialButton = document.querySelector('.tutorial-start');
let nextTutorialButton = document.querySelector('.next-tutorial');
let closeTutorial = document.querySelector('.close-tutorial');
let currentTutorialStep = 0;
let tutorialStepClasses = ['first-section', 'second-section', 'third-section', 'fourth-section', 'fifth-section'];
let tutorialText = ["Welcome to Slots City! To start, click the handle to spin!", "View your Money and Spin Cost below the display", "Once you start getting Two Pairs, more features will be unlocked!", "Once you start getting Jackpots, you can unlock multipliers!", "Lastly, to view how much progress you've made, check out the achievements."];

function initializeTutorial() {
  nextTutorialButton.focus();
  tutorialStepClasses.forEach((cls) => {tutorialDiv.classList.remove(cls);});
  tutorialDiv.classList.add(tutorialStepClasses[currentTutorialStep]);
  tutorialDiv.querySelector('p').textContent = tutorialText[currentTutorialStep];
  playSound(sfx.click);
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
closeTutorial.addEventListener('click', () => {
  tutorialStepClasses.forEach((cls) => {tutorialDiv.classList.remove(cls);});
  playSound(sfx.click);
});

let muteBtn = document.querySelector('.mute');
let soundsMuted = false;
function playSound(audioSource) {
  if (!soundsMuted && !audioSource.muted) {
    const sound = audioSource.cloneNode();
    sound.play();
    sound.addEventListener('ended', () => {
      sound.remove();
    });
  }
}
muteBtn.addEventListener('click', () => {
  soundsMuted = !soundsMuted;
  muteBtn.textContent = soundsMuted ? 'Unmute' : 'Mute';
});

let advancedMuteBoxes = document.querySelectorAll('.sound-checkbox');
let advancedMuteDiv = document.querySelector('.advanced-mute-div');
let advancedMuteBtn = document.querySelector('.advanced-mute');
let advancedMuteCloseBtn = document.querySelector('.close-mute-btn');

advancedMuteBtn.addEventListener('click', () => {
  playSound(sfx.click);
  advancedMuteDiv.classList.toggle('shown');
});
advancedMuteCloseBtn.addEventListener('click', () => {
  playSound(sfx.click);
  advancedMuteDiv.classList.remove('shown');
});

advancedMuteBoxes.forEach((box) => {
  box.addEventListener('change', () => {
    let soundType = box.getAttribute('data-sound');
    sfx[soundType].muted = !box.checked;
    playSound(sfx.click);
  });
});
