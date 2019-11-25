// after parse we got the hierachy of promises
// now it's the time to convert it to a more readable structure
// we use a stack to handler promises layer by layer

export function convert (results) {
  const layers = {}

  Object.keys(results).forEach(key => {
    let cur = results[key]
    // I give it a layer rank flag
    cur._layer = 0
    let layer = layers[key] = []
    let layerSetList = []
    let stack = [ cur ]

    while (stack.length) {
      let now = stack.shift()
      let cinfo = convertInfo(now)
      let layerId = now._layer
      
      if (layer[layerId]) {
        if (! layerSetList[layerId].has(cinfo.id)) {
          layer[layerId].push(cinfo)
          layerSetList[layerId].add(cinfo.id)
        }
      } else {
        layer[layerId] = [ cinfo ]
        layerSetList[layerId] = new Set([ cinfo.id ])
      }

      // traverse siblings and childs
      // s[res] - c[res] - c[rej] - s[rej]
      let tmp = [now.siblings[0], now.child[0], now.child[1], now.siblings[1]]
      for (let item of tmp) {
        if (item) {
          item._layer = layerId + 1
          stack.push(item)
        }
      }
    }
  })

  return layers
}

function convertInfo (item) {
  let formattedItem = null

  if (item.head) {
    // if it's the start part of promise
    formattedItem = {
      head: true,
      realm: item.realm,
      handler: item.handler,
      id: item.id,
      siblingIds: item.siblings.map(sib => sib ? sib.id : null),
      childIds: item.child.map(chi => chi ? chi.id : null)
    }
  } else {
    formattedItem = {
      head: false,
      realm: item.realm,
      res: item.res,
      rej: item.rej,
      id: item.id,
      siblingIds: item.siblings.map(sib => sib ? sib.id : 'null'),
      childIds: item.child.map(chi => chi ? chi.id : 'null')
    }
  }
  return formattedItem
}

let jsPlumbInstance = null

export function link (layerInfo) {
  if (!jsPlumb) return
  jsPlumbInstance && jsPlumbInstance.clear() // clear the prev first
  jsPlumbInstance = jsPlumb.getInstance()
  jsPlumb.ready(function() {
    var common = {
      endpoint: 'Dot',
      connector: ['StateMachine'],
      anchor: ['Bottom', 'Top'],
      paintStyle: { stroke: '#4d1a04', strokeWidth: 3 },
      // endpointStyle: { fill: 'lightgray', outlineStroke: 'darkgray', outlineWidth: 1 },
    }
    
    let flattenedLayer = layerInfo.reduce((r, a) => r.concat(a), [])

    flattenedLayer.forEach(info => {
      let source = 'pid_' + info.id

      if (info.childIds.length > 1) {
        source = 'res_' + info.id
        connect(source, 'pid_' + info.childIds[0])

        source = 'rej_' + info.id
        connect(source, 'pid_' + info.childIds[1])
      } else if (info.childIds.length === 1) {
        connect(source, 'pid_' + info.childIds[0])
      }

      if (info.siblingIds.length > 1) {
        source = 'res_' + info.id
        connect(source, 'pid_' + info.siblingIds[0], false)

        source = 'rej_' + info.id
        connect(source, 'pid_' + info.siblingIds[1], false)
      } else if (info.siblingIds.length === 1) {
        connect(source, 'pid_' + info.siblingIds[0], false)
      }
    })
    function connect (sid, tid, withArrow=true) {
      // ban null link
      if (tid.endsWith('null')) return
      jsPlumbInstance.connect({
        source: sid,
        target: tid,
        overlays: withArrow ? [ ['Arrow', { width: 12, length: 12, location: 0.5 }] ] : []
      }, common)
    }
  })
}

// theme color manipulation
const themeColors = ['#6495ed', '#00cc99', '#669', '#969', '#c6f', '#f99', '#ffc']
let colorIndex = 0
const colorMap = new Map()

export function getThemeColor (realm) {
  let color
  if (color = colorMap.get(realm)) {
    return color
  } else {
    colorMap.set(realm, themeColors[colorIndex++])
    if (colorIndex >= themeColors.length) colorIndex = 0
    return colorMap.get(realm)
  }
}

export function clearThemeMap () {
  colorIndex = 0
  colorMap.clear()
}
