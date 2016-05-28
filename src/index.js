import React from 'react';
import {render} from 'react-dom';
import ThreeAndD from './charts/three-and-d'


class App extends React.Component {



  render () {

  	console.log("HELLO WORLD");

    return (
      <div>
        <h3>3 and D</h3>
        <ThreeAndD />
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));
