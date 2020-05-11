type AvailableCarType = 'Benz' | 'Volkswagen'

let car: AvailableCarType = 'Benz'

interface SparkConstructor {
  new (power: number, accuTime: number): any
}

interface SparkInterface {
  burn (target: BurnableObj): void
}

interface BurnableObj {
  burnWithEffects (): any
}

const MasterSpark: SparkConstructor = class MasterSpark implements SparkInterface {
  power: number
  accuTime: number
  constructor (power=1000, accu=1000) {
    this.power = power
    this.accuTime = accu
  }
  burn (target: BurnableObj) {
    target.burnWithEffects()
  }
}

// abstract class HumanEatting {
//   static isHuman = true
//   abstract eat (...args: unknown[]): unknown
//   abstract digest (): boolean
// }

// class NormalHuman extends HumanEatting {
//   eat (...rest: any[]) {
//     console.log(`eat ${rest}`)
//   }
//   digest () {
//     console.log('digesting')
//     return true
//   }
// }

// const xiaoming = new NormalHuman()

// xiaoming.eat('apple', 'pear', 'rice', 'beef')
// xiaoming.digest()
