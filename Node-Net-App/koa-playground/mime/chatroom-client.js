
$(main)

function main () {
  const inputArea = $('#f-input')
  const talkBtn = $('#talk-btn')
  const talkArea = $('#talk-area > ul')
  const nickName = $('#nick-name')
  const socket = initSocket()
  let userConf = {}

  talkBtn.click(function (e) {
    e.preventDefault()
    let val = inputArea.val()
    if (val = val.replace(/^\s+|\s+$/g, '')) {
      socket.emit('c-chat-message', {
        origin: userConf.nickname,
        text: val
      });
      inputArea.val('')
    }
  })

  socket.on('s-chat-message', function (msg) {
    talkArea.append(`<li>${msg.origin}: ${msg.text}</li>`)
  })

  socket.on('send-tmp-info', function (msg) {
    userConf = msg
    nickName.html(msg.nickname)
  })
}

function initSocket () {
  let socket = io()
  return socket
}
