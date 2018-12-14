function add ({
  a = 'a',
  b = 'b',
  c = 'c'
}) {
  console.log(a + b + c)
}

add({
  b: 'ddd'
})

function anotherAdd ({
  a = 'a',
  b = 'b',
  c = 'c'
} = {}) {
  console.log(a + b + c)
}

anotherAdd({
  c: 'eee'
})

