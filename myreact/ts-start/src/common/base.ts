import { instanceOf } from "prop-types";

export function getParameter (name: string, str: string): string {
  str = str || location.href
  let r = new RegExp('(\\?|#|&)' + name + '=([^&#]*)(&|#|$)')
  let m = str.match(r)
  return decodeURIComponent(!m ? '' : m[2])
}

export function addStyle (style: string | null): void {
  if (!style) return
  var styleList = document.createElement('style')
  styleList.type = 'text/css'
  styleList.innerHTML = style
  let head = document.querySelector('head')
  if (head) head.appendChild(styleList)
}

// 浏览器基础信息
export const browser = {
  versions: (function () {
    let u = navigator.userAgent;
    let app = navigator.appVersion
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) //是否QQ
    }
  }())
}

const _uselessNode = document.createElement('div')

export function scrollFix (elem: HTMLElement | string): void {
  let startTopScroll: number,
      noScroll: boolean, 
      dom: HTMLElement

  if (typeof elem === 'string') {
    dom = document.querySelector(elem) || _uselessNode
  } else {
    dom = elem
  }

  // Handle the start of interactions
  dom.addEventListener('touchstart', function () {
    noScroll = dom.scrollHeight <= dom.clientHeight

    if (!noScroll) {
      startTopScroll = dom.scrollTop

      if (startTopScroll <= 0) { dom.scrollTop = 1 }

      if (startTopScroll + dom.offsetHeight >= dom.scrollHeight) { dom.scrollTop = dom.scrollHeight - dom.offsetHeight - 1 }
    }
  }, false)

  dom.addEventListener('touchmove', function (event: Event) {
    if (noScroll) {
      event.preventDefault()
    }
  })
}
