import React, { Component, lazy, Suspense } from 'react';

const LAnother = lazy(() => import(/* webpackChunkName:"another" */ './Another'))

class App extends Component {
  state = {
    showAnother: false,
    error: false
  }

  handleClick = () => {
    this.setState({ showAnother: true });
  }

  // static getDerivedStateFromError () {
  //   return { error: true }
  // }

  componentDidCatch(error, info) {
    this.setState({ error: true });
  }

  render() { 
    return ( 
        this.state.error ?
          <div>error page</div> :
          <div>
            <button onClick={this.handleClick}>CLICK</button>
            {
              this.state.showAnother && (
                <Suspense fallback={<div>Loading...</div>}>
                  <LAnother />
                </Suspense>
              )
            }
          </div>
    );
  }
}
 
export default App;
