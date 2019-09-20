function getMainCanvas (id="mc") {
  let c
  if (c = document.querySelector('#'+id)) {
    return c
  } else {
    _warn('找不到根canvas元素！')
  }
}

function _warn () {
  let arg = [].slice.call(arguments)
  console.warn.apply(null, arg)
}


