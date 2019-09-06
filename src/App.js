import React, {Component} from 'react';
import Scan from './Scan';
import './App.css';

class App extends Component {
  render = () => (
    <div className="App">
      <header className="App-header">
        <Scan/>
      </header>
    </div>
  );
}

export default App;
