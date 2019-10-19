import React from 'react'
import { Modal } from 'semantic-ui-react'
import Button from './button'
import Context from './context'
import Provider from './provider'
import PasteBin from './pastebin'

// Purposely call each fn without args since we don't need them
const callFns = (...fns) => () => fns.forEach((fn) => fn && fn())

const App = () => {
  const {
    modalOpened,
    slotifiedContent = [],
    slotify,
    onSave,
    openModal,
    closeModal,
  } = React.useContext(Context)
  
  return (
    <div
      style={{
        padding: 12,
        boxSizing: 'border-box',
      }}
    >
      <Modal
        open={modalOpened}
        trigger={
          <Button type="button" onClick={callFns(slotify, openModal)}>
            Start Quotifying
          </Button>
        }
      >
        <Modal.Content
          style={{
            background: '#fff',
            padding: 12,
            color: '#333',
            width: '100%',
          }}
        >
          <div>
            <Modal.Description>
              {slotifiedContent.map((content, index) => (
                <div style={{ whiteSpace: 'pre-line' }} key={index}>{content}</div>
              ))}
            </Modal.Description>
          </div>
          <Modal.Actions>
            <Button type="button" onClick={onSave}>
              SAVE
            </Button>
          </Modal.Actions>
        </Modal.Content>
      </Modal>
      <PasteBin onSubmit={slotify} />
    </div>
  )
}

export default () => (
  <Provider>
    <App />
  </Provider>
)