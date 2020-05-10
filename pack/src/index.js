import { addElementByPromise, injectToDom } from './another'
import '../mime/css/main.css'

document.documentElement.onclick = function () {
  console.log('onclick')
  addElementByPromise().then(injectToDom)
}

if (module.hot) {
  module.hot.accept('./another', () => {
    console.log('hot reloaded')
  })
}

