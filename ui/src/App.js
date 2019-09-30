import React, { Component } from 'react';
import './style/App.css';
import SplitPane from './components/SplitPaneComponent'
import GraphComponent from './components/GraphComponent';
import ControlsComponent from './components/ControlsComponent';

class App extends Component {
  render() {
    return (

      <SplitPane
      left={
        <ControlsComponent/>
      }
      right={
        <GraphComponent colorScheme layout />
      }
      />


    );
  }
}

export default App;
