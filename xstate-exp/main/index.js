const { Machine, interpret, forwardTo, send, actions } = require('xstate');

const { respond, log } = actions;

function alertService(_, receive) {
  receive((event) => {
    if (event.type === 'ALERT') {
      console.log(event.message);
    }
  });
}

const lambMachine = Machine({
  id: 'lamb',
  initial: 'red',
  states: {
    red: {
      on: {
        TRANSIENT: 'green',
      }
    },
    green: {
      on: {
        TRANSIENT: {
          target: 'red',
          actions: [
            respond('RECEIVE', { delay: 1000 }),
            log(() => 'lamb change state to red')
          ]
        }
      }
    }
  }
})

const parentMachine = Machine({
  id: 'parent',
  invoke: {
    id: 'alerter',
    src: () => alertService
  },
  context: { pal: true },
  initial: 'go',
  states: {
    go: {
      invoke: {
        id: 'lambs',
        src: lambMachine,
      },
      on: {
        STOP: 'stop',
        SEND: { actions: send('TRANSIENT', { to: 'lambs' }) },
      }
    },
    stop: {
      
    },
  },
  on: {
    ALERT: { actions: forwardTo('alerter') },
    RECEIVE: { actions: (context, event) => console.log(context, event) }
  }
});

const parentService = interpret(parentMachine).start();

parentService.send('ALERT', { message: 'hello world' });
parentService.send('SEND');
parentService.send('SEND');

