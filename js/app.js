// six alien ships
// prompt('Attack?', 'Press OK to attack or Cancel to retreat')
class Spaceship {
  constructor (name, hitPoints, damage, accuracy) {
    this.name = name;
    this.hull = hitPoints;
    this.firepower = damage;
    this.accuracy = accuracy;
    this.railgun = 0;
    this.missile = 0;
    this.shields = 0;
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

let playerHull = 20;
let alienWaves = 6;

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

let player;

let alienFleet = [];

const createAlienFleet = () => {
  for (let i = 0; i < alienWaves; i++) {
    let alienShip = new Spaceship('Alien Ship', randomNum(3,7), randomNum(2,5), randomNum(6,9) / 10)
    alienFleet.push(alienShip)
  }
}

createAlienFleet();

let nameMyShip = prompt('What is the name of your spaceship?', 'USS Schwarzenegger')
alert('Game is ready. Begin?')

if (!nameMyShip) {
  player = new Spaceship('USS Schwarzenegger', playerHull, 5, .7);
} else {
  player = new Spaceship(nameMyShip, playerHull, 5, .7);
}

const freshStart = () => {
  alienWaves++;
  player.flights++;
  alienFleet = [];
  createAlienFleet();
  player.hull = 20;
  let restartGame = prompt(`New game. Play again? (Now with ${alienWaves} alien ships)\n [${player.points} Total Points] \n [Flights: ${player.flights}]`, 'Press OK to play again or Cancel to end game')
  if (restartGame != null) {
    let shopChoice = prompt(`You have ${player.points}pts. You can spend them below. \n \n${player.name} - \n${player.hull} hull(s), ${player.railgun} railgun(s), ${player.missile} missile(s), and ${player.shields} shield(s) \n \nPrices - \nHull Upgrade: 200pts, Railgun: 150pts, Missile: 100pts, Shields: 80pts`, 'Type purchases here (ex: missile missile hull railgun shields shields)')
    let typedPurchases;
    shopChoice != null ? typedPurchases = shopChoice.split(' ') : typedPurchases = [] // If they pressed OK or Cancel (null)
    typedPurchases[0] == 'Type' ? typedPurchases = [] : undefined // If they pressed OK but entered no text ('Type' would be the first index)
    while (typedPurchases.length > 0) { // Check each string typed in purchase area

      if (typedPurchases[0] == 'hull' && player.points >= 200) {
        player.points -= 200
        playerHull += 5;
      }
      if (typedPurchases[0] == 'railgun' && player.points >= 150) {
        player.points -= 150
        player.railgun += 1;
      }
      if (typedPurchases[0] == 'missile' && player.points >= 100) {
        player.points -= 100
        player.missile += 1;
      }
      if (typedPurchases[0] == 'shields' && player.points >= 80) {
        player.points -= 80
        player.shields += 1;
      }
      typedPurchases.shift()

    }


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
      player.points += 50
      pointTotal += 50
    }
      player.points += player.hull * 10
      pointTotal += player.hull * 10
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
    alert(`The ${player.name} has been blown to smithereens. \n The alien forces advance on Earth. \n You lose!`)
    // freshStart();
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
    if (integrity.hull > 1) { // if more than 1, say "hulls"
      console.log(`The %c${integrity.name} %chas %c${integrity.hull} %chulls remaining.`, 'color: maroon;', 'color: black;', 'color: grey', 'color: black;')
    } else { // if not, keep singular
      console.log(`The %c${integrity.name} %chas %c${integrity.hull} %chull remaining.`, 'color: maroon;', 'color: black;', 'color: grey', 'color: black;')
    }
    anotherPause(gameStart, switchAttacker)
  } else { /// if the ship is about to die, check for shields
    if (player.shields > 0 && integrity.name != 'Alien Ship') {
      player.shields--
      console.log(`The %c${integrity.name} %ctriggers its %cEMERGENCY SHIELDS...`, 'color: green;', 'color: black;', 'color: blue')
      anotherPause(gameStart, switchAttacker)
    } else { /// if no shields, destroy
      console.log(`The %c${integrity.name} %chas been %cDESTROYED!!!`, 'color: maroon;', 'color: black;', 'color: orange')
      anotherPause(destroyShip, integrity)
    }
  }
}

// console.log(`The %c${integrity.name} %chas been %cDESTROYED!!!`, 'color: maroon;', 'color: black;', 'color: orange')

const isAttacking = (attacker) => {
  let victim;
  let missile;
  let chanceOfMissile = Math.floor(Math.random() * 10)
  if (attacker == player.name) {
    victim = alienFleet[0]
    if (player.attack(alienFleet[0])) {
      console.log(`%c${player.name} %chit the %cAlien Ship!`, 'color: green;', 'color: black;', 'color: maroon')
    } else {
      console.log(`%c${player.name} %cmissed the target...`, 'color: green;', 'color: black;')
      missile = true;
    }
  } else {
    victim = player
    if (alienFleet[0].attack(player)) {
      console.log(`%cAlien Ship %chit %c${player.name}!`, 'color: red;', 'color: black;', 'color: maroon')
    } else {
      console.log(`%cAlien Ship %cmissed the target...`, 'color: red;', 'color: black;')
    }
  }
  if (missile == true && chanceOfMissile <= 3 && player.missile > 0) {
    anotherPause(fireMissile, victim)
  } else {
    anotherPause(hullsRemaining, victim)
  }
}

const fireMissile = (param) => {
  player.missile--
  console.log(`But it %clocked%c on with a %cmissile %cand blew it up %cinstantly!`, 'color: orange; border: 1px solid orange;', 'color: black;', 'color: orange;', 'color: black;')
  anotherPause(destroyShip, param)
}

const railGun = (param) => {
  console.log(`You begin with a %cpreemptive strike %cfiring your %cRail Gun...`, 'color: grey;', 'color: black;', 'color: skyblue')
  anotherPause(howMany, param)
}

const howMany = (param) => {
  let damageDone = Math.floor((Math.random() * 3) + 1)
  console.log(`It nails %c${damageDone} %calien ships %cburning %cthem to a crisp...`, 'color: blue;', 'color: black;', 'color: brown;', 'color: skyblue;')
  while (damageDone > 0 && alienFleet.length > 1) {
    damageDone--
    damageDone > 0 ? alienFleet.pop() : undefined;
  }
  player.railgun--
  anotherPause(destroyShip, alienFleet[0])
  //// currently here... add a anotherPause
}

const gameStart = (attacker) => {
  let chanceAtRail = Math.floor(Math.random() * 10)
  console.log(`%c${attacker.name} is attacking...`, 'background: azure;')
  if (attacker.railgun > 0 && chanceAtRail < 3 && alienFleet.length > 1)  {
    anotherPause(railGun, attacker)
  } else {
    anotherPause(isAttacking, attacker.name)
  }
}

const anotherPause = (nextFunc, currentShip) => {
  // if (player.hull > 10) { player.hull = 1}
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
