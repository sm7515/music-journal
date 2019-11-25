import React from 'react';
import { BrowserRouter,Route} from  'react-router-dom';
import Login from './pages/Login'
import Feed from './pages/Feed'
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" exact component={Login} />
        <Route path="/feed" component={Feed}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
