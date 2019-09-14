function getRandom() {
  return Math.random().toString(36).substr(2).toUpperCase()
}

export function randInt(a, b) {
  if (a > b) [a, b] = [b, a]
  let dis = b - a + 1
  return Math.floor(dis * Math.random() + a)
}
