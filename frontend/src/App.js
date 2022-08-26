import React, {useState, useEffect}from 'react';
import { useDispatch } from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import {restoreUser} from './store/session';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  //restore user when app is rendered
  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return isLoaded && (
    <Switch>
      <Route exact path="/login">
        <LoginFormPage/>
      </Route>

    </Switch>
  );
}

export default App;
