const { Machine, interpret, send } = require('xstate');

const wordMachine = Machine({
  id: 'word',
  initial: 'left',
  context: { oa: 1 },
  states: {
    left: {},
    right: {},
    center: {},
    justify: {}
  },
  on: {
    // internal transitions
    LEFT_CLICK: '.left',
    RIGHT_CLICK: { target: '.right' }, // same as '.right'
    CENTER_CLICK: { target: '.center', internal: false }, // same as '.center'
    JUSTIFY_CLICK: { target: 'justify', internal: true } // same as '.justify'
  },
  exit: 'EXIT',
}, {
  actions: {
    EXIT: (context, event) => {
      console.log('exit');
      console.log(context, event)
    }
  }
});

const promiseService = interpret(wordMachine).onTransition(state =>
  console.log(state.value)
);

// Start the service
promiseService.start();

promiseService.send('CENTER_CLICK');

promiseService.send('JUSTIFY_CLICK');


