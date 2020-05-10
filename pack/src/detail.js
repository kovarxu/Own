import { addElementByPromise, injectToDom } from './another'
import '../mime/css/main.css'

window.onload = function () {
  console.log('onload in detail page')
  addElementByPromise().then(injectToDom)
}
