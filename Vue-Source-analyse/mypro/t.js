let hasMapToken = false

if (typeof WeakMap !== 'undefined' && isNative(WeakMap)) {
  hasMapToken = true
}

function hash(str) {
  var hash = 5381;
  var i = str.length;
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0
}

function testIsNull (target) {
  return target === null || target === undefined || (typeof target === 'string' && /^\s*$/.test(target)) || Number.isNaN(target)
}

// begin

function isNative (constructor) {
  return typeof constructor === 'function' && /native code/.test(constructor.toString())
}

function copyRegExp(regExp) {
  const flags =  /\w+/.exec(regExp.flags)
  const result = new regExp.constructor(regExp.source, flags ? flags[0] : '')
  result.lastIndex = regExp.lastIndex
  return result
}

function copySymbol(symbol) {
  let description = symbol.description || symbol.toString().slice(7, -1)
  return Symbol(description)
}

function copyFunction(func) {
  if (isNative(func)) return func
  let f = new Function(`return ${func}`)
  return f()
}

function copyProto(orig, dist) {
  let _proto = Object.getPrototypeOf(orig)
  Object.setPrototypeOf(dist, _proto)
  return dist
}

const TYPE_PRIMITIVE = 1
const TYPE_UNDEF = 2
const TYPE_SYMBOL = 3
const TYPE_DATE = 4
const TYPE_REGEXP = 5
const TYPE_FUNCTION = 6
const TYPE_ARRAY = 7
const TYPE_PLAIN_OBJECT = 8
const TYPE_UNKNOWN = 9

function getType (target) {
  let type = Object.prototype.toString.call(target).slice(8, -1)
  let innerType = typeof target

  if (['number', 'string', 'boolean'].includes(innerType)) {
    return TYPE_PRIMITIVE
  }
  else if (target === null || target === undefined) {
    return TYPE_UNDEF
  }
  else if (type === 'Date') {
    return TYPE_DATE
  }
  else if (innerType === 'symbol') {
    return TYPE_SYMBOL
  }
  else if (type === 'RegExp' && 'lastIndex' in target) {
    return TYPE_REGEXP
  }
  else if (Array.isArray(target)) {
    return TYPE_ARRAY
  }
  else if (innerType === 'function') {
    return TYPE_FUNCTION
  }
  else if (type === 'Object') {
    return TYPE_PLAIN_OBJECT
  }
  else {
    return TYPE_UNKNOWN
  }
}

function copy(target, hMap) {
  let type = getType(target)

  switch (type) {
    case TYPE_PRIMITIVE:
    case TYPE_UNDEF:
      return target
    case TYPE_DATE:
      return new Date(target.getTime())
    case TYPE_REGEXP:
      return copyRegExp(target)
    case TYPE_FUNCTION:
      return copyFunction(target)
    case TYPE_SYMBOL:
      return copySymbol(target)
    case TYPE_ARRAY:
      // ignore properties in array
      hMap = hMap || new WeakMap()
      if (hMap.has(target)) {
        return hMap.get(target)
      }
      else {
        let mirList = []
        hMap.set(target, mirList)
        for (let i = 0; i < target.length; i++) {
          mirList.push(copy(target[i]), hMap)
        }
        return copyProto(target, mirList)
      }
    case TYPE_PLAIN_OBJECT:
      hMap = hMap || new WeakMap()
      if (hMap.has(target)) {
        return hMap.get(target)
      } else {
        let mirObj = {}
        hMap.set(target, mirObj)
        // ignore properties not enumerable
        // ignore Symbol keys
        let keys = Object.keys(target)
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i]
          mirObj[key] = copy(target[key], hMap)
        }
        return copyProto(target, mirObj)
      }
    default:
      console.warn('can\'t detect type of the target: ' + target)
      return target
  }
}


var o = {
    a: 1,
    b: 2,
    [Symbol('a')]: 'dd',
    get [Symbol.toStringTag] () {
        return 'XYZ'
    }
}

Object.defineProperty(o, 'en', {value: false})

console.log(Object.keys(o))
console.log(Reflect.ownKeys(o))
console.log(Object.getOwnPropertyNames(o))
console.log(Object.getOwnPropertySymbols(o))