import React from 'react'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class SplitPane extends React.Component{


    render(){
        return (
            <div className="SplitPane">
              <AppBar position="static">
                <Toolbar>
                </Toolbar>
              </AppBar>

              <div className="SplitPane-left">
                {this.props.left}
              </div>
              <div className="SplitPane-right">
                {this.props.right}
              </div>
            </div>
          );
    }
}

export default SplitPane;