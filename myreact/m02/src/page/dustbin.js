import React, {useState, useEffect} from 'react'

function Peel () {
  const [kind, setKind] = useState('normal')

  return (
    <div>
      Hear is a piece of peel, with kind {kind},
      If you wanna change its kind, input here: 
      <input value={kind} onChange={(e) => setKind(e.target.value)} />
    </div>
  )
}

function Virus (props) {
  const [clickedTime, setClickedTime] = useState(0)

  useEffect(() => {
    function virusFunc () {
      alert('oooooouch!!')
    }

    window.addEventListener('click', virusFunc, false)
    return () => {
      window.removeEventListener('click', virusFunc)
    }
  })

  function onSelfClick() {
    let timeAdd = clickedTime + 1
    if (timeAdd >= 2) {
      props.removeVirus()
    }
    setClickedTime(timeAdd)
  }

  return (
    <div onClick={onSelfClick}>
      <p>|^_^| I am a virus in your computer! |^_^|</p>
      <p>|^_^|   Click me twice to remove me  |^_^|</p>
    </div>
  )
}

export default function Dustbin (props) {
  const [hasVirus, setHasVirus] = useState(true)

  function removeVirus() {
    setHasVirus(false)
  }

  return (
    <div>
      <Peel />
      {hasVirus && <Virus removeVirus={removeVirus} />}
    </div>
  )
}
