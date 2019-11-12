const startSpaceReg = /^\s/g;
const startReg = /^(?:(?:var|let|const)\s+|\s*)([a-zA-z_$][\w_$]*)\s*=\s*(?=new)/;
const newPromiseReg = /^new\s+Promise\(\s*/;
const bodyNewPromiseReg = new RegExp('\(\\s\+return\\s\+\)\?' + newPromiseReg.source.substring(1))
const varableNameReg = /^([a-zA-z_$][\w_$]*)\./
const funcReg = /^function\s*([a-zA-z_$][\w_$]*)?\s*\((.*?)\)\s*|\((.*?)\)\s*(=>)\s*/
const endFunPartReg = /^\s*\)/
const thenReg = /^\s*\.then\(/
const nullReg = /^\s*null\s*/
const funcDelimerReg = /^\s*,\s*/
const additionReg = /^(?=(\s*;?\s*))\1(?!(\s|$))/

const results = {};

function parse (code) {
  let index = 0,
      varName = '',
      // parse Promise
      prePromise = null,
      activePromise = null;

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
    advance(matchedName.length)

    if (results[matchedName]) {
      isCreateNewP = false
      varName = matchedName
    } else {
      throw new Error('未定义的变量名: ' + matchedName)
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
      then: 0
    }
    results[varName] = activePromise
    
    advance(newP[0].length)
  }

  // function
  let handler = parseFuncDefine()
  if (handler) {
    activePromise.handler = handler
    // end of the main part
    parseEndPart()
  }

  // else, arrow func
  // else if (isArrowFunction) {
  //   while (braceNum > 0) {
  //     if (fidx > 0) funcBody += code[fidx - 1]
  //     if (code[fidx] === '(') {
  //       braceNum ++
  //     } else if (code[fidx] === ')') {
  //       braceNum --
  //     } else if (code[fidx] === undefined) {
  //       break
  //     }
  //     fidx ++
  //   }
  //   if (fidx < code.length) {
  //     // the final one is ), that's the end of func part
  //     advance(fidx)
  //   } else {
  //     throw new Error('error in parse arrow function: brace not close propriatly')
  //   }
  // }

  // handle then
  while (1) {
    let controlKeys = code.match(thenReg)
    if (controlKeys) {
      advance(controlKeys[0].length)

      let handlerRes = parseFuncDefine() || parseNullFuncDefine()
      let handlerRej = null

      if (handlerRes) {
        let delimiter = code.match(funcDelimerReg)
        if (delimiter) {
          advance(delimiter[0].length)
          handlerRej = parseFuncDefine() || parseNullFuncDefine()
        }

        prePromise = activePromise
        
        if (prePromise.child.length === 0) {
          activePromise = {
            res: [ handlerRes ],
            rej: [ handlerRej ],
            child: [],
            siblings: []
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
      parseEndPart()
    } else {
      break
    }
  }

  if (code) {
    let remain = code.match(additionReg)
    if (remain) {
      advance(remain[0].length)
      parse(code)
    }
  }
  
  console.log('remain code: ' + code)

  return varName

  function parseEndPart () {
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
      name = funcStart[1] || 'anonymous'
      parameters = funcStart[2]
      advance(funcStart[0].length)

      if (code[0] === '{') {
        body = parseFuncBodyString()
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
    // pat it
    promiseBody = 'new Promise' + promiseBody
    while (1) {
      let controlKeys = psBody.match(thenReg)
      if (controlKeys) {
        psBody = '(' + psBody.substr(controlKeys[0].length)
        let thenBody = findCloseBrace(psBody, '(', ')')
        promiseBody += '.then' + thenBody
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
      throw new Error('函数定义出错: ' + code)
    }
    return null
  }
  
  function parseFuncBodyString () {
    return findCloseBrace(code, '{', '}')
  }

  function findCloseBrace (code, brace, antiBrace) {
    let fidx = 0
    let body = ''
    let braceNum = 1
    if (code[fidx] === brace) {
      body += brace
      while (braceNum) {
        fidx ++
        if (code[fidx] === brace) {
          braceNum ++
        } else if (code[fidx] === antiBrace) {
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

function optimize () {
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
            let name = parse(promise.body)
            if (!promise.return) {
              result.siblings[0] = results[name]
            } else {
              result.child[0] = results[name]
              let j = results[name].then, last = results[name]
              while (j--) {
                last = last.child[0]
              }
              last.child.push(next)
            }
          })
        })
        result.rej.forEach(item => {
          if (!item) return
          item.promises.forEach(promise => {
            let name = parse(promise.body)
            if (!promise.return) {
              result.siblings[1] = results[name]
            } else {
              result.child[1] = results[name]
              let j = results[name].then, last = results[name]
              while (j--) {
                last = last.child[0]
              }
              last.child.push(next)
            }
          })
        })
      }
      result = result.child[0]
    }
  }
}

var pid = 0

function defaultVarName () {
  return '_p' + pid++
} 
