function onload () {
  var skeletons = document.querySelector('#skeleton-container')

  var list = skeletons.querySelector('.skeleton.list')
  var detail = skeletons.querySelector('.skeleton.detail')
  var create = skeletons.querySelector('.skeleton.create')

  list.parentNode.removeChild(list)
  detail.parentNode.removeChild(detail)
  // create.parentNode.removeChild(create)

  skeletons.style['display'] = 'block'
}

onload()
