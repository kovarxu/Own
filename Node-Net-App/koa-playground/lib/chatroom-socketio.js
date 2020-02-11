
module.exports = function socketLogic (server) {
  const io = require('socket.io')(server)
  io.on('connection', (socket) => {
    console.log('a user connected')

    let nickname = selectUniqueNickname()
    idNickMap.set(socket.id, nickname)
    socket.emit('send-tmp-info', {
      nickname
    })

    socket.on('c-chat-message', (msg) => {
      // console.log('message: ' + msg)
      io.emit('s-chat-message', {
        origin: msg.origin,
        text: cleanMsg(msg.text)
      })
    })

    socket.on('disconnect', () => {
      console.log(idNickMap.get(socket.id) + ' disconnected')
    })
  })

  return server
}

// handle banned words
const bannedWords = ['shabi', 'shit', 'nimabi', 'damn', 'fuck']
const _banedWordsReg = new RegExp('\\b' + bannedWords.join('|') + '\\b', 'gi')
function cleanMsg (msg) {
  return msg.replace(_banedWordsReg, '***')
}

// nickname
const nicknamePool = shuffle(['孙不二', '梅辛甘', '曾阿牛', '胡一刀', '鲁智深'])
let _nkid = 0
const idNickMap = new Map()
function selectUniqueNickname () {
  if (nicknamePool.length) {
    return nicknamePool.pop()
  } else {
    return 'User_' + (_nkid++)
  }
}
function shuffle (list) {
  let len = list.length
  for (let i = 0; i < len; i++) {
    let dr = Math.random() * len | 0
    if (i !== dr) {
      let tmp = list[i]
      list[i] = list[dr]
      list[dr] = tmp
    }
  }
  return list.sort((a, b) => Math.random() > 0.5 ? 1 : -1)
}
