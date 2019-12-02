let g = [1,2,3,'a']

let i = g.includes(1)

let go = new Set()

let res = '2323'.includes(2)

go.add('888')

console.log(go.has('000'))

g.filter(item => typeof item !== 'number')

async function foo () {
  await bar()
  console.log('good')
}

function bar () {
  return Promise.resolve(222)
}

class Pointer {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
  dist (nP) {
    return 0
  }
}
