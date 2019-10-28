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
  const [articleId, setArticleId] = useState("")
  const handleArticleSelect = (id)=>{
    setArticleId(id);
    console.log("From App");
    console.log(id);
  }

  return (
      <Router>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/visualization">
                <VisualiztionComponent aId={articleId}/>
              </Route>
              <Route path="/">
                    <EntryComponent handleArticleSelect={handleArticleSelect}/>
              </Route>
            </Switch>
      </Router>
  );
}