export default {
  name: 'FnBoy',
  functional: true,
  props: {
    sel: {
      type: Number,
      default: 1
    }
  },
  render (h, c) {
    if (c.props.sel === 1)
      return h('div', c.data, [c.scopedSlots.default()])
    else
      debugger
      return h('div', c.data, [c.scopedSlots.man({ bar: c.data.attrs.bar })])
  }
}
