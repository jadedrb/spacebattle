// six alien ships
// prompt('Attack?', 'Press OK to attack or Cancel to retreat')

class Spaceship {
  constructor (name, hitPoints, damage, accuracy) {
    this.name = name;
    this.hull = hitPoints;
    this.firepower = damage;
    this.accuracy = accuracy;
    this.points = 0;
    this.flights = 0;
  }
  attack (targetShip) {
    if ((randomNum(1,10) / 10) < this.accuracy) {
      targetShip.hull -= this.firepower;
      return true;
    } else {
      return false;
    }
  }
}

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

let player;

let alienFleet = [];

const createAlienFleet = () => {
  for (let i = 0; i < 6; i++) {
    let alienShip = new Spaceship('Alien Ship', randomNum(3,7), randomNum(2,5), randomNum(6,9) / 10)
    alienFleet.push(alienShip)
  }
}

createAlienFleet();

let nameMyShip = prompt('What is the name of your spaceship?', 'USS Schwarzenegger')
alert('Game is ready. Begin?')

if (!nameMyShip) {
  player = new Spaceship('USS Schwarzenegger', 20, 5, .7);
} else {
  player = new Spaceship(nameMyShip, 20, 5, .7);
}

const freshStart = () => {
  player.flights++;
  alienFleet = [];
  createAlienFleet();
  player.hull = 20;
  let restartGame = prompt(`New game. Play again? \n [${player.points} Total Points] \n [Flights: ${player.flights}]`, 'Press OK to play again or Cancel to end game')
  if (restartGame != null) {
    console.log('..................')
    console.log('..................')
    console.log('..................')
    console.log('..................')
    console.log('..................')
    console.log('..................')
    console.log('N E W  G A M E')
    gameStart(player);
  }
}

const tallyPoints = (victory) => {
  let pointTotal = 0;
  if (victory) {
    if (player.hull >= 20) {
      player.points += 20
      pointTotal += 20
    }
      player.points += player.hull * 5
      pointTotal += player.hull * 5
  } else {
    player.points += (player.hull * 2) - (alienFleet.length * 3)
    pointTotal += (player.hull * 2) - (alienFleet.length * 3)
  }
  return pointTotal;
}

const destroyShip = (destroyed) => {
  if (destroyed.name == 'Alien Ship') {
    alienFleet.shift();
    if (alienFleet.length > 0) {
      let isOrAre = 'are';
      if (alienFleet.length == 1) {
        isOrAre = 'is'
      }
      let decision = prompt(`You destroyed an alien ship. There ${isOrAre} ${alienFleet.length} remaining. \n Resume your assault? [Hulls: ${player.hull}]`, 'Press OK to resume or Cancel to retreat')
      if (decision == null) {
        alert(`Retreating. You live to fight another day. [+${tallyPoints(0)} Points]`)
        freshStart();
      } else {
        console.log('%cYou continue your assault:', 'border: 1px solid grey;')
        gameStart(player)
      }
    } else {
      alert(`Alien threat eliminated. Victory! [+${tallyPoints(1)} Points]`)
      freshStart();
    }
  } else {
    alert(`The ${player.name} has blown into stardust. The alien forces advance on Earth. You lose!`)
    freshStart();
  }
}

const hullsRemaining = (integrity) => {
  let switchAttacker;
  if (integrity.name == 'Alien Ship') {
    switchAttacker = alienFleet[0]
  } else {
    switchAttacker = player
  }
  if (integrity.hull > 0) {
    if (integrity.hull > 1) {
      console.log(`The %c${integrity.name} %chas %c${integrity.hull} %chulls remaining.`, 'color: maroon;', 'color: black;', 'color: grey', 'color: black;')
    } else {
      console.log(`The %c${integrity.name} %chas %c${integrity.hull} %chull remaining.`, 'color: maroon;', 'color: black;', 'color: grey', 'color: black;')
    }
    anotherPause(gameStart, switchAttacker)
  } else {
    console.log(`The %c${integrity.name} %chas been %cDESTROYED!!!`, 'color: maroon;', 'color: black;', 'color: orange')
    anotherPause(destroyShip, integrity)
  }
}

const isAttacking = (attacker) => {
  let victim;
  if (attacker == player.name) {
    victim = alienFleet[0]
    if (player.attack(alienFleet[0])) {
      console.log(`%c${player.name} %chit the %cAlien Ship!`, 'color: green;', 'color: black;', 'color: maroon')
    } else {
      console.log(`%c${player.name} %cmissed the target...`, 'color: green;', 'color: black;')
    }
  } else {
    victim = player
    if (alienFleet[0].attack(player)) {
      console.log(`%cAlien Ship %chit %c${player.name}!`, 'color: red;', 'color: black;', 'color: maroon')
    } else {
      console.log(`%cAlien Ship %cmissed the target...`, 'color: red;', 'color: black;')
    }
  }
  anotherPause(hullsRemaining, victim)
}

const gameStart = (attacker) => {
  console.log(`%c${attacker.name} is attacking...`, 'background: azure;')
  anotherPause(isAttacking, attacker.name)
}

const anotherPause = (nextFunc, currentShip) => {
  setTimeout(() => {
    nextFunc(currentShip);
  }, 1300)
}

console.log('..................')
console.log('..................')
console.log('..................')
console.log('..................')
console.log('..................')
console.log('..................')
console.log('%c S P A C E   B A T T L E', 'font-size: 25px')
console.log('..................')
console.log('..................')
console.log('..................')
console.log('..................')
console.log('..................')
console.log('..................')


anotherPause(gameStart, player)




// while (alienFleet.length > 0) {
//   console.log(`${player.name} is attacking...`)
//   if (player.attack(alienFleet[0]) == 'hit') {
//     console.log(`${alienFleet[0].name} has been HIT!`)
//   } else {
//     console.log(`${player.name} missed the target...`)
//   }
// }
