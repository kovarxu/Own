var startSpaceReg = /^\s/g
var annotationReg = /\/\/.*/g
var startReg = /^(?:(?:var|let|const)\s+|\s*)([a-zA-z_$][\w_$]*)\s*=\s*(?=new|Promise)/
var newPromiseReg = /^new\s+Promise\(\s*/
var resRejReg = /^Promise\.(resolve|reject)\s*/
var bodyNewPromiseReg = new RegExp('\(\\s\+return\\s\+\)\?' + newPromiseReg.source.substring(1))
var varNameReg = /[a-zA-z_$][\w_$]*/
var varableNameReg = new RegExp(`^(${varNameReg.source})\\.(?=then|catch)`)
var funcReg = new RegExp(`^function\\s*(${varNameReg.source})?\\s*\\(([\\s\\S]*?)\\)\\s*|^(${varNameReg.source}|\\([\\w\\s,_$]*?\\))\\s*(=>)\\s*`)
var endFunPartReg = /^\s*\)/
var thenCatchReg = mergeBeginReg('\\.(then|catch)\\(')
var nullReg = mergeBeginReg('null')
var funcDelimerReg = mergeBeginReg(',')
var additionReg = /^(?=(\s*;?\s*))\1(?!(\s|$))/

var $id = 0

function parse (code) {
  var results = {}
  // var useOptmize = true
  build(code, results)
  disposeNesting(results)
  return results
}

function build (code, results) {
  let index = 0,
      varName = '',
      // parse Promise
      prePromise = null,
      activePromise = null;

  // remove annotations first
  code = code.replace(annotationReg, '')

  // dinimish spaces
  if (startSpaceReg.exec(code)) {
    advance(startSpaceReg.lastIndex)
  }

  // resolve `var p1 = new Promise()`
  var start = code.match(startReg)
  var isCreateNewP = true
  if (start) {
    varName = start[1]
    advance(start[0].length)
  }
  // if promise already exists
  else if (varableNameReg.test(code)) {
    let matchedName = code.match(varableNameReg)[1]

    // boundary condition, 'Promise' itself can't be a variable name
    if (matchedName !== 'Promise') {
      advance(matchedName.length)
      if (results[matchedName]) {
        isCreateNewP = false
        varName = matchedName
      } else {
        throw new TypeError('Undefined variable: ' + matchedName)
      }
    } else {
      varName = defaultVarName()
    }
  }
  // anonymous promise
  else {
    varName = defaultVarName()
  }

  if (!results[varName]) {
    results[varName] = []
  } else {
    // if Promise already exists
    // then find the last child base on results[varName].then
    let then = results[varName].then
    let lastChild = results[varName]
    while (then--) {
      lastChild = lastChild.child[0]
    }
    activePromise = lastChild
  }

  // new Promise
  var newP = code.match(newPromiseReg)  
  if (newP) {
    activePromise = {
      handler: null,
      child: [],
      siblings: [],
      then: 0,
      id: ++$id,
      realm: varName,
      head: true
    }
    results[varName] = activePromise
    
    advance(newP[0].length)
  }

  // Promise.resolve / Promise.reject
  if (!activePromise) {
    let resj = code.match(resRejReg)
    if (resj) {
      advance(resj[0].length)
      let body = findCloseBrace(code, '(', ')')
      let handler = `function (resolve, reject) { ${resj[1]}${body} }`
      code = code.slice(body.length)
      // add an anti brace for the next step
      code = handler + ')' + code

      activePromise = {
        handler: null,
        child: [],
        siblings: [],
        then: 0,
        id: ++$id,
        realm: varName,
        head: true
      }

      results[varName] = activePromise
    }
  }

  // activePromise not found, we should terminate this parse
  if (!activePromise) {
    delete results[varName]
    return
  }
  // function
  let handler = parseFuncDefine()
  if (handler) {
    activePromise.handler = handler
    // end of the main part
    parseEndBrace()
  }

  // handle then/catch
  while (1) {
    let controlKeys = code.match(thenCatchReg)
    if (controlKeys) {
      advance(controlKeys[0].length)
      let isCatch = controlKeys[1] === 'catch'
      
      let handlerRes = parseFuncDefine() || parseNullFuncDefine()
      let handlerRej = null
      
      if (handlerRes) {
        if (isCatch) {
          // if control key is catch, we should only point to the handlerRej
          handlerRej = handlerRes
          handlerRes = null
        } else {
          let delimiter = code.match(funcDelimerReg)
          if (delimiter) {
            advance(delimiter[0].length)
            handlerRej = parseFuncDefine() || parseNullFuncDefine()
          }
        }

        prePromise = activePromise
        
        if (prePromise.child.length === 0) {
          activePromise = {
            res: [ handlerRes ],
            rej: [ handlerRej ],
            child: [],
            siblings: [],
            id: ++$id,
            realm: varName
          }
          prePromise.child.push(activePromise)
          // save number of then only when creating new promise
          if (isCreateNewP) {
            results[varName].then ++
          }
        } else {
          // multi then
          activePromise = prePromise.child[0]
          activePromise.res.push(handlerRes)
          activePromise.rej.push(handlerRej)
        }
      }

      // the last brace
      parseEndBrace()
    } else {
      break
    }
  }

  if (code) {
    let remain = code.match(additionReg)
    if (remain) {
      advance(remain[0].length)
      build(code, results)
    }
  }
  
  // console.log('remain code: ' + code)

  return varName

  function parseEndBrace () {
    let endPart = code.match(endFunPartReg)
    if (endPart) {
      advance(endPart[0].length)
    }
  }

  function parseFuncDefine () {
    let name = '',
        parameters = '',
        body = '',
        promises = null
  
    let funcStart = code.match(funcReg)
    if (funcStart) {
      let isArrowFunction = false
      // arrow function
      if (funcStart[4] == '=>') {
        isArrowFunction = true
        name = 'anonymous~arrow'
        let params = funcStart[3]
        parameters = params.startsWith('(') ? params.slice(1, params.length-1) : params
      } else {
        name = funcStart[1] || 'anonymous'
        parameters = funcStart[2]
      }
      advance(funcStart[0].length)

      if (code[0] === '{' || isArrowFunction) {
        body = parseFuncBodyString(isArrowFunction)
        advance(body.length)
      }

      if (body) {
        promises = parsePromiseInBody(body)
      }

      return { name, parameters, body, promises }
    }
  }

  function parsePromiseInBody (body) {
    let bnp
    let promises = []
    while (bnp = body.match(bodyNewPromiseReg)) {
      let offset = bnp.index + bnp[0].length
      let promiseBody = parsePromiseFromStartOffset(body, offset)
      let isReturn = bnp[1] !== undefined
      promises.push({
        return: isReturn,
        body: promiseBody
      })
      if (isReturn) break
      body = body.substr(offset + promiseBody.length - 1)
    }
    return promises
  }

  function parsePromiseFromStartOffset (body, startIdx) {
    let psBody = '(' + body.substr(startIdx)
    let promiseBody = findCloseBrace(psBody, '(', ')')
    psBody = psBody.substr(promiseBody.length)
    // wrap it back
    promiseBody = 'new Promise' + promiseBody
    while (1) {
      let controlKeys = psBody.match(thenCatchReg)
      if (controlKeys) {
        psBody = '(' + psBody.substr(controlKeys[0].length)
        let thenBody = findCloseBrace(psBody, '(', ')')
        promiseBody += '.' + controlKeys[1] + thenBody

        // we should cut the parsed parts
        psBody = psBody.slice(thenBody.length)
        if (thenBody = psBody.match(additionReg)) {
          psBody = psBody.slice(thenBody[0].length)
        }
      } else {
        break
      }
    }
    return promiseBody
  }

  function parseNullFuncDefine () {
    let nullRes = code.match(nullReg)
    if (nullRes) {
      advance(nullRes[0].length)
    } else {
      throw new Error('function define error: ' + code)
    }
    return null
  }
  
  function parseFuncBodyString (isArrowFunction) {
    // Arrow Fuction 
    // may be data => data + 1 or data => (data + 1) or data => {return data + 1}
    // if it's the two previous condition, we should convert the algorithm to the last one
    // the first condition needs much intelligence, TODO someday ...
    if (isArrowFunction && code[0] === '(') {
      let body = findCloseBrace(code, '(', ')')
      if (body) body = body.slice(1, body.length - 1)
      return `{ return ${body} }`
    } else {
      return findCloseBrace(code, '{', '}')
    }
  }

  function findCloseBrace (code, brace, counterpart) {
    let fidx = 0
    let body = ''
    let braceNum = 1
    if (code[fidx] === brace) {
      body += brace
      while (braceNum) {
        fidx ++
        if (code[fidx] === brace) {
          braceNum ++
        } else if (code[fidx] === counterpart) {
          braceNum --
        } else if (code[fidx] === undefined) {
          break
        }
        body += code[fidx]
      }
      if (fidx < code.length) {
        return body
      } else {
        throw new Error('brace not close propriatly')
      }
    }
  }
  
  function advance (n) {
    index += n;
    code = code.substring(n);
  }
}

function disposeNesting (results) {
  // in this step, we handle some new promises in then or return blocks
  // just handle the initialized results in the first pass 
  for (key in results) {
    let result = results[key]
    while (result) {
      let next = result.child[0]
      if (result.res) {
        result.res.forEach(item => {
          if (!item) return
          item.promises.forEach(promise => {
            let childPromise = getUniqItem(parse(promise.body))
            if (!promise.return) {
              result.siblings[0] = childPromise
              // we should also set this
              result.siblings[1] = null
            } else {
              result.child[0] = childPromise
              result.child[1] = null
              let j = childPromise.then, last = childPromise
              while (j--) {
                last = last.child[0]
              }
              if (next) last.child.push(next)
            }
          })
        })
        result.rej.forEach(item => {
          if (!item) return
          item.promises.forEach(promise => {
            let childPromise = getUniqItem(parse(promise.body))
            if (!promise.return) {
              // we should also set this
              if (!result.siblings[0]) result.siblings[0] = null
              result.siblings[1] = childPromise
              // boundary condition
              result.child[1] = next
            } else {
              if (!result.child[0]) result.child[0] = null
              result.child[1] = childPromise
              let j = childPromise.then, last = childPromise
              while (j--) {
                last = last.child[0]
              }
              if (next) last.child.push(next)
            }
          })
        })
      }
      result = result.child[0]
    }
  }
}

function getUniqItem (obj) {
  if (obj && typeof obj === 'object') {
    let keys = Object.keys(obj)
    if (keys.length === 1)
      return obj[keys[0]]
    else
      throw new Error('the parsed object has more than one attributes, maybe it has been contaminated !')
  }
}

function mergeBeginReg (source) {
  return new RegExp(`^\\s*${source}\\s*`)
}

var $pid = 0

function defaultVarName () {
  return '_p' + $pid++
} 

function resetParser () {
  $id = 0
  $pid = 0
}

module.exports = parse
