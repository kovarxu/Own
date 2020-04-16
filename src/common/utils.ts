import { typeAlias } from "@babel/types";

type CheckFunc = (target: any) => boolean

interface LoadingOptions {
  text: string,
  lock?: boolean,
  spinner?: 'el-icon-loading',
  background?: string
}

interface LoadingComponentMethods {
  close: () => void
}

interface ContextWithLoading {
  loading: LoadingComponentMethods,
  $loading: (options: LoadingOptions) => any
}

export function testIsNull (target: any): boolean {
  // null undefined '' NaN
  return target === null || target === undefined || (typeof target === 'string' && /^\s*$/.test(target)) || Number.isNaN(target)
}

const isTypeGen = function (typename: string): CheckFunc {
  return function (target) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === typename.toLowerCase()
  }
}

export const isObject = isTypeGen('object')

export async function loadingHandlerWrapper (actionPromise: Promise<void>, context: ContextWithLoading) {
  _showLoading('', context)
  await actionPromise.finally(() => _hideLoading(context))
}

function _showLoading (text: string, context: ContextWithLoading) {
  context.loading = context.$loading({
    lock: true,
    text: text || '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.6)'
  })
}

function _hideLoading (context: ContextWithLoading) {
  context.loading.close()
}