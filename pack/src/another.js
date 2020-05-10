
export function getList () {
  let l = [1, 2, 3, 0, 66]
  _.compact(l)
  return l
}

export function addElementByPromise () {
  return import(/* webpackChunkName: "markStyle" */ '../mime/css/mark.css').then(() => {
    const elm = document.createElement('p')
    elm.innerHTML = 'I love webpack.'
    elm.classList.add('before-mark')
    return elm
  })
}

export function injectToDom(elm) {
  document.body.appendChild(elm)
}
