const startSpaceReg = /^\s/g;
const startReg = /^(?:(?:var|let|const)\s+|\s*)([a-zA-z_$][\w_$]*)\s*=\s*(?=new)/;
const newPromiseReg = /^new\s+Promise\(\s*/;
const varableNameReg = /^[a-zA-z_$][\w_$]*/
const funcReg = /^function\s*([a-zA-z_$][\w_$]*)?\s*\((.*?)\)\s*|\((.*?)\)\s*(=>)\s*/
const endFunPartReg = /^\s*\)/
const thenReg = /^\.then\(/
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

  // 消除空格
  if (startSpaceReg.exec(code)) {
    advance(startSpaceReg.lastIndex)
  }

  // 解析`var p1 = new Promise()`这种形式
  var start = code.match(startReg)
  var isCreateNewP = true
  if (start) {
    varName = start[1]
    advance(start[0].length)
  }
  // 已存在该变量名
  else if (varableNameReg.test(code)) {
    let matchedName = code.match(varableNameReg)[0]
    advance(matchedName.length)

    if (results[matchedName]) {
      isCreateNewP = false
      varName = matchedName
    } else {
      throw new Error('未定义的变量名: ' + matchedName)
    }
  }
  // 匿名promise
  else {
    varName = defaultVarName()
  }

  if (!results[varName]) {
    results[varName] = []
  } else {
    // 如果这个Promise已经存在了
    // 先依据results[varName].then找到最后一个child
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

    // 主体部分终止
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

  // 处理then
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
            child: []
          }
          prePromise.child.push(activePromise)
          // 只在创建新Promise时，保存then的数量
          if (isCreateNewP) {
            results[varName].then ++
          }
        } else {
          // 多次then的情况
          activePromise = prePromise.child[0]
          activePromise.res.push(handlerRes)
          activePromise.rej.push(handlerRej)
        }
      }

      // 处理最后的括号
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

  function parseEndPart () {
    let endPart = code.match(endFunPartReg)
    if (endPart) {
      advance(endPart[0].length)
    }
  }

  function parseFuncDefine () {
    let name = '',
        parameters = '',
        body = ''
  
    let funcStart = code.match(funcReg)
    if (funcStart) {
      name = funcStart[1] || 'anonymous'
      parameters = funcStart[2]
      advance(funcStart[0].length)

      if (code[0] === '{') {
        body = parseFuncBodyString()
        advance(body.length)
      }

      return { name, parameters, body }
    }
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
    let fidx = 0
    let body = ''
    let braceNum = 1
    // in func brace
    if (code[fidx] === '{') {
      body += '{'
      while (braceNum) {
        fidx ++
        if (code[fidx] === '{') {
          braceNum ++
        } else if (code[fidx] === '}') {
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

var pid = 0

function defaultVarName () {
  return '_p' + pid++
} 
