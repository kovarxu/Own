class ReadHead {
  constructor (s) {
    this.s = s
    this.p = 0
  }
}

class State {
  constructor (id, expression, convert) {
    this.id = id
    this.isFinite = expression.length === 1
    this.char = expression[0]
    if (!this.isFinite) this.save = []
  }

  convertTo (c) {
    if (this.isFinite) return this.id + 1
    else if (this.char === c || this.char === '.') {
      this.save.push(c)
      return this.id
    }
    else return false
  }
}

class Controller {
  constructor () {

  }

  walk (readhead, cur) {
    let next = states[cur].convertTo(readhead.s[readhead.p])
    if (next) {
      readhead.p++
      this.walk(readhead, next)
    } else {
      // backtracking
      while (1) {
        
      }
    }
  }
}