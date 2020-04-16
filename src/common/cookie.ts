
type SetCookieOptions = {
  name: string,
  value: string,
  expires?: number,
  path?: string,
  domain?: string,
  secure?: boolean
}

type DelCookieOptions = Pick<SetCookieOptions, 'name' | 'path' | 'domain' | 'secure'>

export function getCookie (key: string): string {
  let r = new RegExp('(?:^|;+|\\s+)' + key + '=([^;]*)')
  let m = document.cookie.match(r)
  return (!m ? '' : m[1])
}

//写入cookie
export function setCookie (options: SetCookieOptions): string {
  let exp = new Date()
  let expiresTime = options.expires ? new Date(exp.setMinutes(exp.getMinutes() + options.expires)) : ''
  return document.cookie = name + '=' + escape(options.value) + (expiresTime instanceof Date ? ';expires=' + expiresTime.toUTCString() : '') + (options.value ? ';path=' + options.value : '') + (options.domain ? ';domain=' + options.domain : '') + (options.secure ? ';secure' : '')
}

// 删除cookie
export function delCookie (options: DelCookieOptions): boolean {
  let value = getCookie(name)
  if (value !== '') {
    let exp = new Date()
    exp.setMinutes(exp.getMinutes() - 1000)
    document.cookie = name + '=;expires=' + exp.toUTCString() + (options.path ? ';path=' + options.path : '/') + (options.domain ? ';domain=' + options.domain : '') + (options.secure ? ';secure' : '')
    return true
  }
  return false
}
