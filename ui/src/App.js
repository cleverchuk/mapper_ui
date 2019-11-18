import  React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import EntryComponent from './components/EntryComponent';
import VisualiztionComponent from './components/VisualizationComponent';


export default function App(props) {
  const [articles, setArticles] = useState(new Set())
  const handleProceed = (currentSelected)=>{
    setArticles(currentSelected);
  }

  return (
      <Router>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/visualization">
                <VisualiztionComponent articles={articles}/>
              </Route>
              <Route path="/">
                    <EntryComponent handleProceed={handleProceed}/>
              </Route>
            </Switch>
      </Router>
  );
}