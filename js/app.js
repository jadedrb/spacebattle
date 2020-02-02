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
    this.fuel = 5;
    this.kills = 0;
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
let totalPointsEarned = 0;
let gameSpeed = 1300;

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

let player;
let playerFleet = [];
let alienFleet = [];

const createAlienFleet = () => {
  for (let i = 0; i < alienWaves; i++) {
    let alienShip = new Spaceship('Alien Ship', randomNum(3,7), randomNum(2,5), randomNum(6,9) / 10)
    alienFleet.push(alienShip)
  }
}

const newShip = () => { /// Starts the game. Also introduces new player ships when another one dies
  let nameMyShip = prompt('What is the name of your spaceship?', 'USS Schwarzenegger')
  alert(`If your console isn't open, press:\nCommand+Option+J on Mac\nCommand+Shift+J on Windows\n\nGame is ready. Begin? `)

  if (!nameMyShip) {
    player = new Spaceship('USS Schwarzenegger', playerHull, 5, .7);
  } else {
    player = new Spaceship(nameMyShip, playerHull, 5, .7);
  }
  playerFleet.push(player)
  totalPointsEarned = 0;
  alienFleet = [];
  alienWaves = 6;
  playerHull = 20;
  createAlienFleet();
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
}

const freshStart = () => {
  alienWaves++;
  player.flights++;
  alienFleet = [];
  createAlienFleet();
  let restartGame = prompt(`New wave. Keep playing? (Now with ${alienWaves} alien ships)\n [${player.points} Total Points] \n [Flights: ${player.flights}]`, `Adjust game speed here (ex: '1300'))`)
  if (restartGame != null && restartGame.length <= 4) { // change game speed
    gameSpeed = parseInt(restartGame) // make sure game speed is a number
    console.log(`--Game speed changed to ${gameSpeed}.`)
  }
  if (restartGame != null) {
    let shopChoice = prompt(`You have ${player.points}pts. You can spend them below. \n \n${player.name} - \n${playerHull} hull(s), ${player.fuel} fuel, ${player.railgun} railgun(s), ${player.missile} missile(s), and ${player.shields} shield(s) \n \nPrices - \nHull Upgrade: 200pts, Railgun: 150pts, Missile: 100pts, Shields: 80pts, Fuel: 50pts`, 'Type purchases here (ex: missile missile hull railgun shields shields)')
    let typedPurchases;
    shopChoice != null ? typedPurchases = shopChoice.split(' ') : typedPurchases = [] // If they pressed OK or Cancel (null)
    typedPurchases[0] == 'Type' ? typedPurchases = [] : undefined // If they pressed OK but entered no text ('Type' would be the first index)
    while (typedPurchases.length > 0) { // Check each string typed in purchase area

      if (typedPurchases[0] == 'hull' && player.points >= 200) {
        console.log(`--Hull upgrade purchased.`)
        player.points -= 200
        playerHull += 5;
      }
      if (typedPurchases[0] == 'railgun' && player.points >= 150) {
        console.log(`--Railgun round purchased.`)
        player.points -= 150
        player.railgun += 1;
      }
      if (typedPurchases[0] == 'missile' && player.points >= 100) {
        console.log(`--Missile purchased.`)
        player.points -= 100
        player.missile += 1;
      }
      if (typedPurchases[0] == 'shields' && player.points >= 80) {
        console.log(`--Shields purchased.`)
        player.points -= 80
        player.shields += 1;
      }
      if (typedPurchases[0] == 'fuel' && player.points >= 50) {
        console.log(`--Fuel purchased.`)
        player.points -= 50
        player.fuel += 1;
      }
      typedPurchases.shift()

    }

    player.hull = playerHull;
    console.log('..................')
    console.log('..................')
    console.log('..................')
    console.log('..................')
    console.log('..................')
    console.log('..................')
    console.log('N E W  W A V E')
    gameStart(player);

  } else {
    showStatline();
  }
}

const tallyPoints = (victory) => {
  let pointTotal = 0;
  if (victory) {
    // More hits taken = greater risk = greater reward
    pointTotal = (5 * alienWaves) + ((playerHull - player.hull) * 5);
  } else {
    // If you retreat, you get significantly less
    pointTotal = (playerHull - player.hull) * 3
  }
  player.points += pointTotal
  totalPointsEarned += pointTotal
  return pointTotal
}

const destroyShip = (destroyed) => {
  if (destroyed.name == 'Alien Ship') {
    alienFleet.shift();
    if (alienFleet.length > 0) {
      let decision = prompt(`You destroyed an alien ship. There ${alienFleet.length == 1 ? 'is' : 'are'} ${alienFleet.length} remaining. \n Resume your assault? [Hulls: ${player.hull}] [Fuel: ${player.fuel}]`, 'Press OK to resume or Cancel to retreat (requires 1 fuel)')
      if (decision == null && player.fuel > 0) {
        player.fuel--;
        alert(`Retreating. You live to fight another day. [+${tallyPoints(0)} Points]`)
        freshStart();
      } else if (decision == null) {
        console.log('%cYour fuel is as low as your morale. You continue the assault unwilling.', 'border: 1px solid grey;')
        gameStart(player, 'railgun')
      } else {
        console.log('%cYou continue your assault:', 'border: 1px solid grey;')
        gameStart(player, 'railgun')
      }
    } else {
      alert(`Alien threat eliminated. Victory! [+${tallyPoints(1)} Points]`)
      freshStart();
    }
  } else {
    alert(`The ${player.name} has been blown to smithereens. \nThe alien forces advance on Earth. \n\nYou lose!`)
    showStatline();
  }
}

const showStatline = () => {
  document.getElementById('stats').innerHTML += `<div><h1>${player.name}</h1><p>Flights: ${player.flights}</p><p>Kills: ${player.kills}</p><p>Total Points Earned: ${totalPointsEarned}</p></div>`
  gameSpeed = 5000;
  anotherPause(askAgain, player);
}

const askAgain = () => {
  let askAgain = prompt('Would you like to play again with a new spaceship?', `If not you'll have to restart your browser to play again`)
  if (askAgain) {
    gameSpeed = 1300;
    anotherPause(newShip, player);
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
      player.hull = 1;
      console.log(`The %c${integrity.name} %ctriggers its %cEMERGENCY SHIELDS...`, 'color: green;', 'color: black;', 'color: blue')
      anotherPause(gameStart, switchAttacker)
    } else { /// if no shields, destroy
      console.log(`The %c${integrity.name} %chas been %cDESTROYED!!!`, 'color: maroon;', 'color: black;', 'color: orange')
      integrity.name == 'Alien Ship' ? player.kills++ : undefined;
      anotherPause(destroyShip, integrity)
    }
  }
}

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
      console.log(`%cAlien Ship %chit %c${player.name}! %c[-${alienFleet[0].firepower}]`, 'color: red;', 'color: black;', 'color: maroon', 'color: grey')
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
  console.log(`...But it %clocked%c on with a %cmissile. %cBOOM!!!`, 'color: orange; border: 1px solid orange;', 'color: black;', 'color: grey;', 'color: orange;')
  anotherPause(destroyShip, param)
}

const railGun = (param) => {
  console.log(`You begin with a %cpreemptive strike %cfiring your %cRail Gun...`, 'color: grey;', 'color: black;', 'color: skyblue')
  anotherPause(howMany, param)
}

const howMany = (param) => { // as in how many alien ships does the rail gun hit
  let damageDone = Math.floor((Math.random() * 5) + 1)
  console.log(`It nails %c${alienFleet.length < damageDone ? 'all remaining' : damageDone} %calien ships %cburning them to a crisp...`, 'color: blue;', 'color: black;', 'color: skyblue;')
  player.kills += damageDone;
  while (damageDone > 0 && alienFleet.length > 0) {
    damageDone--
    damageDone > 0 ? alienFleet.pop() : undefined;
  }
  player.railgun--
  anotherPause(destroyShip, alienFleet[0])
}

const gameStart = (attacker, string) => {
  let chanceAtRail = Math.floor(Math.random() * 10)
  console.log(`%c${attacker.name} is attacking...`, 'background: azure;')
  if (attacker.railgun > 0 && chanceAtRail < 2 && alienFleet.length > 1 && string == 'railgun')  {
    anotherPause(railGun, attacker)
  } else {
    anotherPause(isAttacking, attacker.name)
  }
}

const anotherPause = (nextFunc, currentShip) => { // adds a pause between each function and each console log
  // player.hull > 5 ? player.hull = 1 : undefined /// delete later
  setTimeout(() => {
    nextFunc(currentShip);
  }, gameSpeed)
}

newShip();
