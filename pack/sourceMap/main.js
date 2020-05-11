const vlq = require('vlq')

const source = ';AAQA,IAAI,GAAG,GAAqB,MAAM,CAAA;AAElC,IAAI,WAAW,GAAU;IACvB,QAAQ,EAAE,KAAK;IACf,IAAI,CAAE,MAAM;QACV,MAAM,CAAC,eAAe,EAAE,CAAA;IAC1B,CAAC;CACF,CAAA'
// const source = 'AACA;AClFA'

// console.log(source.split(/[,;]/).filter(item => item).map(vlq.decode))

function extract (sourceString) {
  const lines = sourceString.split(';')
  return lines.map(line => line.split(',').map(vlq.decode))
}

console.log(extract(source))
